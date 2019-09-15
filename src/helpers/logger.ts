import * as Winston from "winston";
import config from "../configs/logger";

// Winston.setLevels(Winston.config.syslog.levels);

export const logger = new (Winston.Logger)({ exitOnError: false });

if (process.env.NODE_ENV != "test") {
	logger.add(Winston.transports.Console, config.console);
	logger.add(Winston.transports.File, config.file);
}

export default logger;