import SocketIO from "socket.io";
import server from "./server";
import { ChatRoom } from "./models/chatroom";
import logger from "./helpers/logger";

const socketIO = SocketIO(server);
const redisAdapter = require("socket.io-redis");
socketIO.adapter(redisAdapter({ host: process.env.REDIS_URL, port: process.env.REDIS_PORT }));

/*
// Multiple Chatrooms FAILED
socketIO.on("connection", async (client) => {
	// Creates Chat Room
	client.on("chatroom create", (aRoom: string) => {
		client.join(aRoom);
		const newRoom = ChatRoom.create(aRoom);
		socketIO.emit("chatroom created", aRoom);
		logger.silly(`chatroom created: ${aRoom}`);
	});

	// Join Room
	client.on("chatroom join", (aRoom: string) => {
		// Check if already exists
		logger.silly(`chatroom join: ${aRoom}`);
		client.join(aRoom);
	});

	client.on("chatroom message", (aRoom: string, aMessage: string) => {
		redis.lpush("conversation:userA:userB", "Hello World");
		redis.rpop("conversation:userA:userB");
		socketIO.to(aRoom).emit(aMessage);
	});

	// Shows Available rooms
	client.on("show chatrooms", () => {
		logger.silly(`show chatrooms`);
		client.emit("showed chatrooms", { rooms: socketIO.sockets.adapter.rooms });
		socketIO.of("/").adapter.allRooms()
	});
	client.on("disconnect", () => logger.silly(`Client ${client.id} has disconnected from server`));
});
*/

export default socketIO;

ChatRoom.create();