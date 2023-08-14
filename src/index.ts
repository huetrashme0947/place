// src/index.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { platform } from "os";
import { logger, silenceLogger } from "./logging";
import { createWss } from "./wss";
import { ConfigurationKeys, getConfigValue } from "./configuration";
import { Database } from "./database";

const PACKAGE_VERSION = "1.0.0";

/**
 * The project's main function. Starts the WebSocket server and initializes all modules.
 * @alpha
 */
export async function main(silent = false) {
	if (!silent) {
		console.log(`Huechan /place/ Backend ${PACKAGE_VERSION}\n(c) 2023 HUE_TrashMe\n`);
	} else {
		silenceLogger();
	}

	if (platform() == "win32") {
		logger.warn("Huechan Place is designed to run on UNIX-compatible systems. While\n"+
		" ".repeat(34)+"usage on non-UNIX systems like Microsoft Windows is technically\n"+
		" ".repeat(34)+"possible, there may be unexpected behavior. Please refer to the\n"+
		" ".repeat(34)+"documentation for more information. Proceed with caution.");
	}

	// Test configuration and database modules
	try {
		await getConfigValue(ConfigurationKeys.Startup);
		await Database.getTile([0,0]);
	} catch (err) {
		return;
	}

	logger.info("[wss] Starting WebSocket server...");

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const wss = createWss();

	logger.info("[wss] Ready");
}

main();