export const config = {
	console: {
		level: process.env.LOGGER_LEVEL_CONSOLE || "silly",
		colorize: true,
		timestamp: true,
		handleExceptions: true,
		humanReadableUnhandledException: true,
	},
	file: {
		level: process.env.LOGGER_LEVEL_FILE || "info",
		filename: "logs",
		handleExceptions: true,
		humanReadableUnhandledException: true,
	}
};

export default config;