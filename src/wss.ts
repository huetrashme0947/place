// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer, WebSocket } from "ws";

import { Coordinates, Colors } from "./types";
import { action_poll } from "./poll";

/**
 * Creates and configures a new {@link WebSocketServer} and returns it.
 */
export function createWss() {
	// Create WebSocket server
	const wss = new WebSocketServer({port: 947});

	// On new connection
	wss.on("connection", (ws) => wssOnconnection(ws));

	return wss;
}

function wssOnconnection(ws: WebSocket) {
	ws.on("message", async (data) => {
		let req: WSRequest;
		// Try parsing data as JSON, else return error
		try {
			req = JSON.parse(data.toString());
			if (!isWSRequest(req)) {
				throw new Error();
			}
		} catch {
			const res: WSErrorResponse = {
				success: false,
				action: WSRequestActions.Unknown,
				error_code: 400		// 400 Bad Request
			}
			ws.send(JSON.stringify(res));
			return;
		}

		let res: WSResponse;

		if (req.action == WSRequestActions.Canvas) {

		} else if (req.action == WSRequestActions.Poll && req.coordinates) {
			res = await action_poll(req.coordinates);
		} else if (req.action == WSRequestActions.Draw) {

		} else {
			res = {
				success: false,
				action: WSRequestActions.Unknown,
				error_code: 400		// 400 Bad Request
			} as WSErrorResponse;
		}

		ws.send(JSON.stringify(res));
		return;
	});
}

/**
 * Incoming WebSocket request received by a client.
 */
interface WSRequest {
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

/**
 * Type guard for {@link WSRequest}. Checks the given object literal for interface compliance.
 * @param obj Object to check
 * @deprecated Interface compliance is now checked by the action functions themselves, rendering this function obsolete.
 */
function isWSRequest(obj: any): obj is Request {
	if (obj.action === WSRequestActions.Canvas ||
		obj.action === WSRequestActions.Info) {
		return true;
	} else if (obj.action === WSRequestActions.Poll) {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			typeof obj.coordinates[2] === "undefined") {
			return true;
		} else {
			return false;
		}
	} else if (obj.action === WSRequestActions.Draw) {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			typeof obj.coordinates[2] === "undefined" &&
			Number(obj.color) === obj.color &&
			obj.color >= Colors.White && obj.color <= Colors.Albania) {
			return true;
		} else {
			return false;
		}
	}

	return false;
}