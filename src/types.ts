// src/index.d.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { getCurrentCanvasSize } from "./configuration";

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

export async function checkCoordinates(coordinates: Coordinates) {
	// Check if coordinates are valid
	const canvasSize = await getCurrentCanvasSize();
	return !(coordinates[0] < 0 ||
		coordinates[0] >= canvasSize[0] ||
		coordinates[1] < 0 ||
		coordinates[1] >= canvasSize[1]);
}