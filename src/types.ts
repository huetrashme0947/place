// src/index.d.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

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