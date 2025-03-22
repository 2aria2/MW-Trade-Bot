const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

/**
* Logger instance for general logging (not errors).
* Configured to log regular info, warn, and debug messages to both a rotated file and the console.
* The log format includes timestamps and JSON formatting.
* 
* @type {import('winston').Logger}
*/
const logger = createLogger({
	level: "info", // Default log level
	format: format.combine(
		format.timestamp(),
		format.json() // Log output in JSON format
	),
	transports: [
		// Daily rotation for general logs
		new DailyRotateFile({
			filename: "logs/general-%DATE%.log", // Logs will be saved in a logs/ folder with the date in the filename
			datePattern: "YYYY-MM-DD", // Daily rotation
			zippedArchive: true, // Optionally compress old log files
			maxSize: "20m", // Maximum size of each log file before rotating
			maxFiles: "14d", // Keep logs for the last 14 days
		}),
		new transports.Console({ level: "debug" }), // Log to console with 'debug' level for more verbose output in development
	],
});

/**
* Logs an informational message.
* 
* @param {string} message The message to log.
* @param {Object} [context={}] Optional additional context-specific information to log with the message.
* 
* @returns {void}
*/
global.logInfo = (message, context = {}) => {
	logger.info({
		message: message,
		...context // Additional context-specific information
	});
};

/**
* Logs a warning message.
* 
* @param {string} message The warning message to log.
* @param {Object} [context={}] Optional additional context-specific information to log with the message.
* 
* @returns {void}
*/
global.logWarn = (message, context = {}) => {
	logger.warn({
		message: message,
		...context // Additional context-specific information
	});
};

/**
* Logs a debug message.
* 
* @param {string} message The debug message to log.
* @param {Object} [context={}] Optional additional context-specific information to log with the message.
* 
* @returns {void}
*/
global.logDebug = (message, context = {}) => {
	logger.debug({
		message: message,
		...context // Additional context-specific information
	});
};

// module.exports = { logInfo, logWarn, logDebug };