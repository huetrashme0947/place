// src/poll.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates, checkCoordinates } from "./types";
import { WSSuccessResponse, WSRequestActions, WSErrorResponse } from "./wss";
import { Database } from "./database";

/**
 * Returns a {@link WSPollResponse} containing the color and timestamp of the given tile.
 * @param coordinates Coordinates of tile
 */
export async function action_poll(coordinates: Coordinates) {
	// Check if coordinates are valid
	if (!(await checkCoordinates(coordinates))) {
		return {
			success: false,
			action: WSRequestActions.Poll,
			error_code: 403		// 403 Forbidden
		} as WSErrorResponse;
	}

	const res: WSPollResponse = {
		success: true,
		action: WSRequestActions.Poll,
		coordinates: coordinates,
		color: Colors.White,
		timestamp: 0
	};
	
	// Get color and timestamp values from database
	res.color = await Database.getTile(coordinates);
	res.timestamp = await Database.getDrawTimestamp(coordinates);

	return res;
}

interface WSPollResponse extends WSSuccessResponse {
	coordinates: Coordinates,
	color: Colors,
	timestamp: number
}