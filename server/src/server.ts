import { resolve } from "path";
import { readFileSync } from "fs";
import { createServer } from "https";
import { logger } from "./helpers/logger";
import app from "./serve";

const server = createServer({
	key: readFileSync(resolve("./certs/key.pem")),
	cert: readFileSync(resolve("./certs/cert.pem")),
}, app);

server.listen(process.env.PORT, () => {
	logger.debug(`App is running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
	logger.debug(`Press CTRL-C to stop\n`);
});

export default server;