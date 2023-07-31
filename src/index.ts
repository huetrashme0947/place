// src/index.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { logger } from "./logging";
import { createWss } from "./wss";

async function main() {
	console.log("Huechan /place/ Backend 1.0.0\n(c) 2023 HUE_TrashMe\n");

	logger.info("[wss] Starting WebSocket server...");

	const wss = createWss();

	logger.info("[wss] Ready");
}

main();