// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { logger } from "./helpers/logger";
import app from "./serve";

// ToDo: Add HTTPS with certificates
const server = createServer({}, app);

server.listen(process.env.PORT, () => {
	logger.debug(`App is running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
	logger.debug(`Press CTRL-C to stop\n`);
});

export default server;