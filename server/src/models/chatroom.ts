import { v4 } from "uuid";
import { Message } from "./message";
import socketIO from "../app";
import SocketIO from "socket.io";
import logger from "../helpers/logger";
import { User } from "./user";

const isACommand: RegExp = /^\/stock=/;

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
			.of(this.uuid)
			.on("connection", (client: SocketIO.Socket) => {
				// Adds client to the Bot list
				client.on("bot add", (message) => this.addRobot(client, message));

				// Broadcasts message of stock
				client.on("message", (message) => this.receiveMessage(client, message));

				// Logs disconnection from Room
				client.on("disconnect", () => logger.silly(`Client ${client.id} has disconnected from Room ${this.uuid}`));
			});
	}

	public addRobot(client: SocketIO.Socket, secret: any) {
		logger.silly("Bot Add");
		(secret || true) ? this.bot = (client.id) : undefined;
		client.emit("bot added");
	}

	public receiveMessage(client: SocketIO.Socket, message: string) {
		logger.silly(message + " " + this.uuid);
		if (isACommand.test(message))
			this.requestStockInfo(client, message.replace(isACommand, ""));
		else
			this.broadcastMessage(client, message);
	}

	private broadcastMessage(client: SocketIO.Socket, aMessage: string) {
		// ToDo: This message should be stored in a database
		const messageObject: Message = new Message({ text: aMessage, submitter: new User({ name: client.id }) });
		this.messages.push(messageObject);
		this.socket.send(messageObject);
	}

	private requestStockInfo(client: SocketIO.Socket, aStock: string) {
		logger.silly("Request stock data");
		// ToDo: Check if there is a bot available
		client.to(this.bot).emit("stock", aStock);
	}
}