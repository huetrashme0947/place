// src/index.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { logger } from "./logging";
import { createWss } from "./wss";

const PACKAGE_VERSION = "1.0.0";

/**
 * The project's main function. Starts the WebSocket server and initializes all modules.
 * @alpha
 */
async function main() {
	console.log(`Huechan /place/ Backend ${PACKAGE_VERSION}\n(c) 2023 HUE_TrashMe\n`);

	logger.info("[wss] Starting WebSocket server...");

	const wss = createWss();

	logger.info("[wss] Ready");
}

main();