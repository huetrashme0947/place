// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";

import { logger } from "./logging";
import { Coordinates } from "./types";
import { getCurrentCanvasSize } from "./configuration";

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

	export async function setTile(coordinates: Coordinates, value: number) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}
		
		// Update tile
		await client.bitField("place", [{
			"operation": "SET",
			"encoding": "u4",
			"offset": await calculateTileOffset(coordinates),
			"value": value
		}]);

		// Update timestamp
		await client.set(`place_timestamp:${coordinates[0]}:${coordinates[1]}`, Date.now());
	}

	export async function getTile(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}

		return await client.bitField("place", [{
			"operation": "GET",
			"encoding": "u4",
			"offset": await calculateTileOffset(coordinates)
		}]);
	}

	export async function getDrawTimestamp(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}

		return await client.get(`place_timestamp:${coordinates[0]}:${coordinates[1]}`);
	}

	/**
	 * Calculates the offset used to address the database bitfield
	 * @param {Coordinates} coordinates The coordinates of the tile to be addressed
	 * @returns {Promise<number>}
	 */
	async function calculateTileOffset(coordinates: Coordinates) {
		const [canvasWidth] = await getCurrentCanvasSize();
		return ((coordinates[1] * canvasWidth) + coordinates[0]) * 4;
	}
}

export default Database;