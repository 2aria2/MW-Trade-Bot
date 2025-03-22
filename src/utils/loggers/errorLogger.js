const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

/**
* Logger instance for error logging.
* Configured to log errors to both a rotated file and the console.
* The log format includes timestamps, stack trace, and JSON formatting.
* 
* @type {import('winston').Logger}
*/
const logger = createLogger({
	level: "error",
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.json()
	),
	transports: [
		// Daily rotation for error logs
		new DailyRotateFile({
			filename: "logs/error-%DATE%.log", // Logs will be saved in a logs/ folder, with the date appended to the filename
			datePattern: "YYYY-MM-DD", // Daily rotation
			zippedArchive: true, // Optionally compress old log files
			maxSize: "20m", // Maximum size of each log file before rotating
			maxFiles: "14d", // Keep logs for the last 14 days
		}),
		new transports.Console(), // Log to console for development/debugging
	],
});

/**
* Logs an error message along with the stack trace and optional additional context.
* 
* @param {Error} error The error object to log, including message and stack.
* @param {Object} [context={}] Optional additional context-specific information to log with the error.
* @param {string} [context.someContextData] Example of extra contextual information you might want to log.
* 
* @returns {void}
*/

global.logError = (messageOrError, contextOrError = {}) => {
	// Case 1: First param is a string message, second param is an Error
	if (typeof messageOrError === "string" && contextOrError instanceof Error) {
	  logger.error({
			message: messageOrError,
			errorMessage: contextOrError.message,
			stack: contextOrError.stack
	  });
	}
	// Case 2: First param is a string message, second param is context object
	else if (typeof messageOrError === "string" && typeof contextOrError === "object") {
	  logger.error({
			message: messageOrError,
			...(contextOrError.error ? { 
		  errorMessage: contextOrError.error.message,
		  stack: contextOrError.error.stack 
			} : {}),
			...contextOrError
	  });
	}
	// Case 3: First param is an Error object
	else if (messageOrError instanceof Error) {
	  logger.error({
			message: messageOrError.message,
			stack: messageOrError.stack,
			...(typeof contextOrError === "object" ? contextOrError : {})
	  });
	}
	// Case 4: Handle unexpected types
	else {
	  logger.error({
			message: "An unexpected error occurred",
			originalInput: messageOrError,
			stack: (new Error()).stack,
			...(typeof contextOrError === "object" ? contextOrError : {})
	  });
	}
};
// module.exports = { logError };