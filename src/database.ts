// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";

import { logger } from "./logging";
import { Colors, Coordinates } from "./types";
import { getCurrentCanvasSize } from "./configuration";

namespace Database {
	let client = createClient();

	/**
	 * Initializes the Redis client and connects it to the database.
	 */
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

	/**
	 * Overwrites the tile at the given coordinates with the given color and updates the corresponding timestamp.
	 * @param coordinates Coordinates of the tile to be written
	 * @param color Color to write to the given tile
	 */
	export async function setTile(coordinates: Coordinates, color: Colors) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}
		
		// Update tile
		await client.bitField("place", [{
			"operation": "SET",
			"encoding": "u4",
			"offset": await calculateTileOffset(coordinates),
			"value": color
		}]);

		// Update timestamp
		await client.set(`place_timestamp:${coordinates[0]}:${coordinates[1]}`, Date.now());
	}

	/**
	 * Returns the color of the given tile.
	 * @param coordinates Coordinates of tile
	 */
	export async function getTile(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}

		const [color] = await client.bitField("place", [{
			"operation": "GET",
			"encoding": "u4",
			"offset": await calculateTileOffset(coordinates)
		}]);

		return color ? color : Colors.White;
	}

	/**
	 * Returns the timestamp of when the given tile was last updated.
	 * @param coordinates Coordinates of tile
	 */
	export async function getDrawTimestamp(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!client.isReady) {
			await setupClient();
		}

		return await client.get(`place_timestamp:${coordinates[0]}:${coordinates[1]}`);
	}

	/**
	 * Calculates the offset used to address the database bitfield based on the coordinates of a tile.
	 * @param coordinates Coordinates of tile
	 */
	async function calculateTileOffset(coordinates: Coordinates) {
		const [canvasWidth] = await getCurrentCanvasSize();
		return ((coordinates[1] * canvasWidth) + coordinates[0]) * 4;
	}
}

export default Database;