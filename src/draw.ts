// src/draw.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { checkForSpecialMode } from "./configuration";
import { startCooldown } from "./cooldown";
import { Database } from "./database";
import { Colors, Coordinates, WSReturnsTileResponse, checkCoordinates } from "./types";
import { WSRequestActions, WSErrorResponse } from "./types";

/**
 * Updates the given tile with the given color.
 * @param coordinates Coordinates of tile
 * @param color A color
 */
export async function action_draw(coordinates: Coordinates, color: Colors, remoteAddr: string): Promise<WSErrorResponse | WSDrawResponse> {
	// Check if coordinates are valid
	if (!(await checkCoordinates(coordinates))) {
		return {
			success: false,
			action: WSRequestActions.Draw,
			error_code: 400		// 400 Bad Request
		};
	}

	// If Special mode is active, check if colors is Colors.Special0 or Colors.Special1
	if (await checkForSpecialMode() && color != Colors.Special0 && color != Colors.Special1) {
		return {
			success: false,
			action: WSRequestActions.Draw,
			error_code: 403		// 403 Forbidden
		};
	}

	// Start cooldown
	if (await startCooldown(remoteAddr) !== 0) {
		// Cooldown already active
		return {
			success: false,
			action: WSRequestActions.Draw,
			error_code: 403		// 403 Forbidden
		};
	}

	// Set given tile and update timestamp
	const timestamp = await Database.setTile(coordinates, color);

	// Return success response
	return {
		success: true,
		action: WSRequestActions.Draw,
		coordinates: coordinates,
		color: color,
		timestamp: timestamp
	};
}

interface WSDrawResponse extends WSReturnsTileResponse {
	action: WSRequestActions.Draw
}