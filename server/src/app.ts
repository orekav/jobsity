import SocketIO from "socket.io";
import server from "./server";
import { ChatRoom } from "./models/chatroom";
import logger from "./helpers/logger";

const socketIO = SocketIO(server);

socketIO.on("connection", (client) => {
	// Creates Chat Room
	client.on("chatroom create", () => {
		const newRoom = ChatRoom.create();
		socketIO.emit("chatroom created", newRoom.uuid);
		logger.silly(`chatroom created: ${newRoom.uuid}`);
	});

	// Shows Available rooms
	client.on("show chatrooms", () => {
		logger.silly(`show chatrooms`);
		client.emit("showed chatrooms", Object.keys(socketIO.nsps));
	});

	client.on("disconnect", () => logger.silly(`Client ${client.id} has disconnected from server`));
});

export default socketIO;