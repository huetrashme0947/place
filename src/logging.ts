// src/logging.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import * as winston from "winston";

const logfileFormat = winston.format.printf(({ level, message, label, timestamp }) => {
	return `[${timestamp}] [${level}] ${message}`;
});

const consoleFormat = winston.format.printf(({ level, message, label, timestamp }) => {
	let output = `[${timestamp}] [${level}] ${message}`;

	switch (level) {
		case "error":
			output = `\u001b[31m${output}\u001b[0m`;
			break;
		
		case "warn":
			output = `\u001b[33m${output}\u001b[0m`;
			break;
		
		case "http":
		case "verbose":
		case "debug":
		case "silly":
			output = `\u001b[34m${output}\u001b[0m`;
			break;
		
		case "info":
		default:
			break;
	}
	
	return output;
});

export const logger = winston.createLogger({
	level: "silly",
	transports: [
		new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp(), consoleFormat) }),
		new winston.transports.File({ filename: "log/combined.log", level: "info", format: winston.format.combine(winston.format.timestamp(), logfileFormat) })
	]
});