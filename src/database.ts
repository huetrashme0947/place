// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";
import { Buffer } from "buffer";

import { logger } from "./logging";
import { Colors, Coordinates } from "./types";
import { getCurrentCanvasSize } from "./configuration";

/**
 * Contains high level (use case-specific) static methods for accessing the Redis database.
 */
export class Database {
	private static client = createClient();

	/**
	 * Initializes the Redis client and connects it to the database.
	 */
	private static async setupClient() {
		logger.info("[database] Connecting to database...");

		try {
			this.client.on("error", err => { throw err; });
			await this.client.connect();
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
	public static async setTile(coordinates: Coordinates, color: Colors) {
		// Check if client is ready to answer requests, if not wait
		if (!this.client.isReady) {
			await this.setupClient();
		}
		
		// Update tile
		await this.client.bitField("place", [{
			"operation": "SET",
			"encoding": "u4",
			"offset": await this.calculateTileOffset(coordinates),
			"value": color
		}]);

		// Update timestamp
		await this.client.set(`place_timestamp:${coordinates[0]}:${coordinates[1]}`, Date.now());
	}

	/**
	 * Returns the color of the given tile.
	 * @param coordinates Coordinates of tile
	 */
	public static async getTile(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!this.client.isReady) {
			await this.setupClient();
		}

		const [color] = await this.client.bitField(`place:${coordinates[1]}`, [{
			"operation": "GET",
			"encoding": "u4",
			"offset": coordinates[0] * 4
		}]);

		return color ? color as Colors : Colors.White;
	}

	/**
	 * Returns the timestamp of when the given tile was last updated.
	 * @param coordinates Coordinates of tile
	 */
	public static async getDrawTimestamp(coordinates: Coordinates) {
		// Check if client is ready to answer requests, if not wait
		if (!this.client.isReady) {
			await this.setupClient();
		}

		return Number(await this.client.get(`place_timestamp:${coordinates[0]}:${coordinates[1]}`));
	}

	/**
	 * Reads the whole canvas from the database and returns it as a {@link Buffer}.
	 * If the width of the canvas is odd, the last 4 bits of each row will consist of padding data.
	 */
	public static async getCanvas() {
		// Check if client is ready to answer requests, if not wait
		if (!this.client.isReady) {
			await this.setupClient();
		}

		// Get canvas size
		const canvasSize = await getCurrentCanvasSize();

		// Create GET operation for every tile row
		let transaction = await this.client.multi();
		for (let i = 0; i < canvasSize[1]; i++) {
			transaction = transaction.get(`place:${i}`);
		}

		// Execute all operations and write results to buffer
		const outBuffer = Buffer.alloc(Math.ceil(canvasSize[0] / 2) * canvasSize[1]);
		const results = await transaction.exec();
		results.forEach((result, index) => {
			// If the row is undefined, pad with null bytes
			const rowStr = result ? result.toString() : "\0".repeat(Math.ceil(canvasSize[0] / 2));
			const offset = Math.ceil(canvasSize[0] / 2) * index;
			outBuffer.write(rowStr, offset);
		});

		return outBuffer;
	}

	/**
	 * Calculates the offset used to address the database bitfield based on the coordinates of a tile.
	 * @param coordinates Coordinates of tile
	 */
	private static async calculateTileOffset(coordinates: Coordinates) {
		const [canvasWidth] = await getCurrentCanvasSize();
		return ((coordinates[1] * canvasWidth) + coordinates[0]) * 4;
	}
}