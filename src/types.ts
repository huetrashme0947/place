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
	
	Special0,
	Special1
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

/**
 * Incoming WebSocket request received by a client.
 */
export interface WSRequest {
	action: WSRequestActions,
	coordinates?: Coordinates,
	color?: Colors
}

/**
 * Actions supported by the WebSocket server.
 */
export enum WSRequestActions {
	Info = "info",
	Canvas = "canvas",
	Poll = "poll",
	Draw = "draw",
	Unknown = "unknown"
}

/**
 * Response returned by the WebSocket server.
 */
export interface WSResponse {
	success: boolean
}

/**
 * Response returned by the WebSocket server in case of an successful action.
 */
export interface WSSuccessResponse extends WSResponse {
	success: true,
	action: WSRequestActions
}

/**
 * Response returned by the WebSocket server in case of an unsuccessful action or invalid request.
 */
export interface WSErrorResponse extends WSResponse {
	success: false,
	action: WSRequestActions,
	error_code: number
}