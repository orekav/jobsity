import handler from "serve-handler";
import { resolve } from "path";
import { IncomingMessage, ServerResponse } from "http";

const serveListener = async (request: IncomingMessage, response: ServerResponse) => {
	await handler(request, response, { public: resolve("public") });
};

export default serveListener;