import { v4 } from "uuid";
import { Message } from "./message";
import socketIO from "../app";
import SocketIO from "socket.io";
import logger from "../helpers/logger";
import { User } from "./user";
import Redis from "redis";

const redis = Redis.createClient({ host: process.env.REDIS_URL, port: Number(process.env.REDIS_PORT) });
const isACommand: RegExp = /^\/stock=/;
const chatLimit = 50;

interface ChatRoomProperties {
	messages?: Message[];
	uuid?: string;
}

export class ChatRoom {
	public uuid: string;
	public messages: Message[];
	private socket: SocketIO.Namespace;
	private bot: string;

	constructor(properties: ChatRoomProperties) {
		this.uuid = properties.uuid || v4();
		this.messages = properties.messages || [];
	}

	static create() {
		const newRoom = new ChatRoom({});
		newRoom.createSocket();
		return newRoom;
	}

	public createSocket() {
		this.socket = socketIO
			// .to(this.uuid)
			.on("connection", (client: SocketIO.Socket) => {
				// Adds client to the Bot list
				client.on("bot add", (message) => this.addRobot(client, message));

				// Broadcasts message of stock
				client.on("message", (message) => this.receiveMessage(client, message));

				// Get History
				client.on("history get", () => this.getHistory(client));

				// Logs disconnection from Room
				client.on("disconnect", () => logger.silly(`Client ${client.id} has disconnected from Room ${this.uuid}`));
			});
	}

	private addRobot(client: SocketIO.Socket, secret: any) {
		logger.silly("Bot Add");
		(secret || true) ? this.bot = (client.id) : undefined;
		// client.join(this.uuid);
		client.emit("bot added");
	}

	private receiveMessage(client: SocketIO.Socket, message: string) {
		logger.silly(message + " " + this.uuid);
		if (isACommand.test(message))
			this.requestStockInfo(client, message.replace(isACommand, ""));
		else
			this.broadcastMessage(client, message);
	}

	private broadcastMessage(client: SocketIO.Socket, aMessage: string) {
		// ToDo: This message should be stored in a database
		const messageObject: Message = new Message({ text: aMessage, submitter: new User({ name: client.id }) });
		redis.rpush("messages", JSON.stringify(messageObject), (err, quantity) => {
			if (quantity > chatLimit)
				redis.lpop("messages");
		});
		this.socket.send(messageObject);
	}

	private getHistory(client: SocketIO.Socket) {
		redis.lrange("messages", 0, chatLimit, (err, messages) => {
			client.emit(
				"history got",
				messages.map(
					(aMessage: string) => new Message(JSON.parse(aMessage))
				)
			);
		});
	}

	private requestStockInfo(client: SocketIO.Socket, aStock: string) {
		logger.silly("Request stock data");
		// ToDo: Check if there is a bot available
		// client.to(this.bot).emit("stock", aStock);
		client.broadcast.emit("stock", aStock);
	}
}