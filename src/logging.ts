// src/logging.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import * as winston from "winston";
import { ConfigurationKeys, getConfigValue } from "./configuration";

const logfileFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `[${timestamp}] [${level}] ${message}`;
});

const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
	let output = `[${timestamp}] [${level}] ${message}`;

	switch (level) {
	// Output message in red
	case "error":
		output = `\u001b[31m${output}\u001b[0m`;
		break;
	
	// Output message in yellow
	case "warn":
		output = `\u001b[33m${output}\u001b[0m`;
		break;
	
	// Output message in blue
	case "http":
	case "verbose":
	case "debug":
	case "silly":
		output = `\u001b[36m${output}\u001b[0m`;
		break;
	
	// Output message in white
	case "info":
	default:
		break;
	}
	
	return output;
});

/**
 * Global interface for logging status messages to the console and a shared logfile.
 */
export let logger: winston.Logger;

// Get logfile path and init logger
export async function setupLogger() {
	logger = winston.createLogger({
		level: "silly",
		transports: [
			new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp(), consoleFormat) })
		]
	});
	const logfile = await getConfigValue(ConfigurationKeys.LogfilePath);
	logger.add(new winston.transports.File({ filename: logfile, level: "info", format: winston.format.combine(winston.format.timestamp(), logfileFormat) }));
}

export async function silenceLogger() {
	if (!logger) await setupLogger();
	logger.silent = true;
}