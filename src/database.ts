// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";

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
	 * Returns a string representing the given row
	 * @param y Y-coordinate of row
	 */
	public static async getRow(y: number) {
		// Check if client is ready to answer requests, if not wait
		if (!this.client.isReady) {
			await this.setupClient();
		}

		// Retrieve row from database
		const rowStr = await this.client.get(`place:${Math.round(y)}`);

		// Get canvasWidth and calculate desired output string length
		const [canvasWidth] = await getCurrentCanvasSize();
		const outStrLen = Math.ceil(canvasWidth / 2);

		// If null, return string containing null bytes
		if (rowStr === null) return "\0".repeat(outStrLen);

		// Pad or shorten string to fit desired length
		if (rowStr.length < outStrLen) return rowStr.padEnd(outStrLen, "\0");
		if (rowStr.length > outStrLen) return rowStr.slice(0, outStrLen);

		return rowStr;
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
	 * Calculates the offset used to address the database bitfield based on the coordinates of a tile.
	 * @param coordinates Coordinates of tile
	 */
	private static async calculateTileOffset(coordinates: Coordinates) {
		const [canvasWidth] = await getCurrentCanvasSize();
		return ((coordinates[1] * canvasWidth) + coordinates[0]) * 4;
	}
}