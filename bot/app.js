const request = require("request");
const io = require("socket.io-client");

const url = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const socket = io(url, { secure: process.env.SERVER_PROTOCOL == "https", reconnect: true, rejectUnauthorized: false });

socket.on("connect", () => console.log("Connected"));

socket.emit("bot add");
socket.on("stock", (stock) => {
    request.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`, {}, (error, response) => {
        const [headersLine, ...dataLines] = response.body.split("\r\n");
        const properties = headersLine.split(",");
        const stocks = dataLines.map((aStockString) => {
            if (aStockString != "") {
                const splittedStockString = aStockString.split(",");
                return properties.reduce(
                    (aStock, aProperty, anIndex) => {
                        aStock[aProperty] = splittedStockString[anIndex];
                        return aStock;
                    },
                    {}
                );
            }
        }, []);
        if (Number(stocks[0].Close))
            socket.send(`${stocks[0].Symbol} quote is ${stocks[0].Close} per share`);
        else
            socket.send(`${stock.toUpperCase()} quote could not be processed or was not found`);
    });
});