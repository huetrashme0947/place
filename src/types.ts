// src/index.d.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { getCurrentCanvasSize } from "./configuration";
import { WSSuccessResponse } from "./wss";

/**
 * Coordinates of a tile on the /place/ canvas.
 */
export type Coordinates = readonly [x: number, y: number];

/**
 * Colors supported by the /place/ canvas.
 */
export enum Colors {
	White,
	Grey,
	Black,
	Brown,

	Pink,
	Purple,
	Orange,
	Red,

	Cyan,
	Yellow,
	LightGreen,
	DarkGreen,

	OceanBlue,
	DarkBlue,
	
	Serbia,
	Albania
}

/**
 * Response returned by the WebSocket server containing coordinates, color and timestamp of a tile.
 */
export interface WSReturnsTileResponse extends WSSuccessResponse {
	coordinates: Coordinates,
	color: Colors,
	timestamp: number
}

/**
 * Returns true if the given coordinates are valid at the time being. Returns false if they are not.
 * @param coordinates Coordinates
 */
export async function checkCoordinates(coordinates: Coordinates) {
	const canvasSize = await getCurrentCanvasSize();
	return !(coordinates[0] < 0 ||
		coordinates[0] >= canvasSize[0] ||
		coordinates[1] < 0 ||
		coordinates[1] >= canvasSize[1]);
}