// src/poll.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates } from "./types";
import { Response } from "./wss";
import { Database } from "./database";

/**
 * Returns a {@link PollResponse} containung the color and timestamp of the given tile.
 * @param coordinates Coordinates of tile
 */
export async function action_poll(coordinates: Coordinates) {
	const res: PollResponse = {
		success: true,
		coordinates: coordinates,
		color: Colors.White,
		timestamp: 0
	}
	
	// Get color and timestamp values from database
	const color = await Database.getTile(coordinates);
	const timestamp = await Database.getDrawTimestamp(coordinates);

	return {
		success: true,
		coordinates: coordinates,
		color: color,
		timestamp: timestamp
	} as PollResponse;
}

interface PollResponse extends Response {
	success: true,
	coordinates: Coordinates,
	color: Colors,
	timestamp: number
}