// src/poll.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates, WSReturnsTileResponse, checkCoordinates } from "./types";
import { WSRequestActions, WSErrorResponse } from "./wss";
import { Database } from "./database";

/**
 * Returns a {@link WSPollResponse} containing the color and timestamp of the given tile or a {@link WSErrorResponse} in case of invalid coordinates.
 * @param coordinates Coordinates of tile
 */
export async function action_poll(coordinates: Coordinates): Promise<WSErrorResponse | WSPollResponse> {
	// Check if coordinates are valid
	if (!(await checkCoordinates(coordinates))) {
		return {
			success: false,
			action: WSRequestActions.Poll,
			error_code: 403		// 403 Forbidden
		};
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

interface WSPollResponse extends WSReturnsTileResponse {
	action: WSRequestActions.Poll
}