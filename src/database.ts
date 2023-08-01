// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";

import { logger } from "./logging";

namespace Database {
	let client = createClient();

	async function setupClient() {
		logger.info("[database] Connecting to database...");

		try {
			client.on("error", err => { throw err });
			await client.connect();
		} catch (err) {
			logger.error("[database] An error occured while establishing connection to database");
			throw err;
		}

		logger.info("[database] Ready");
	}

	export async function setTile(offset: number, value: number) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}
		
		await client.bitField("place", [{
			"operation": "SET",
			"encoding": "u4",
			"offset": offset,
			"value": value
		}]);
	}
}

export default Database;