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
	ws.on("message", (data) => {
		let req: Request;
		// Try parsing data as JSON, else return error
		try {
			req = JSON.parse(data.toString());
			if (!isRequest(req)) {
				throw new Error();
			}
		} catch {
			const res: ErrorResponse = {
				success: false,
				error_code: 400		// 400 Bad Request
			}
			ws.send(JSON.stringify(res));
			return;
		}

		if (req.action == "canvas") {

		} else if (req.action == "poll" && req.coordinates) {
			action_poll(req.coordinates)
		} else if (req.action == "draw") {

		}
	});
}

/**
 * Incoming WebSocket request received by a client.
 */
interface Request {
	action: RequestActions,
	coordinates?: Coordinates,
	color?: Colors
}

/**
 * Actions supported by the WebSocket server.
 */
enum RequestActions {
	Info = "info",
	Canvas = "canvas",
	Poll = "poll",
	Draw = "draw"
}

/**
 * Response returned by the WebSocket server.
 */
export interface Response {
	success: boolean
}

/**
 * Response returned by the WebSocket server in case of an unsuccessful action or invalid request.
 */
interface ErrorResponse extends Response {
	success: false,
	error_code: number
}

/**
 * Type guard for the {@link Request} interface. Checks the given object literal for interface compliance.
 * @param obj Object to check
 */
function isRequest(obj: any): obj is Request {
	if (obj.action === RequestActions.Canvas ||
		obj.action === RequestActions.Info) {
		return true;
	} else if (obj.action === RequestActions.Poll) {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			typeof obj.coordinates[2] === "undefined") {
			return true;
		} else {
			return false;
		}
	} else if (obj.action === RequestActions.Draw) {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			typeof obj.coordinates[2] === "undefined" &&
			Number(obj.color) === obj.color &&
			obj.color >= 0 && obj.color <= 15) {
			return true;
		} else {
			return false;
		}
	}

	return false;
}