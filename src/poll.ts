// src/poll.ts
// Huechan  /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates } from "./types";
import { WSSuccessResponse, WSRequestActions, WSErrorResponse } from "./wss";
import { Database } from "./database";
import { getCurrentCanvasSize } from "./configuration";

/**
 * Returns a {@link WSPollResponse} containing the color and timestamp of the given tile.
 * @param coordinates Coordinates of tile
 */
export async function action_poll(coordinates: Coordinates) {
	// Check if coordinates are valid
	const canvasSize = await getCurrentCanvasSize();
	if (coordinates[0] < 0 ||
		coordinates[0] >= canvasSize[0] ||
		coordinates[1] < 0 ||
		coordinates[1] >= canvasSize[1]) {
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