// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer, WebSocket } from "ws";

import { Coordinates, Colors } from "./types";

export function createWss() {
	// Create WebSocket server
	const wss = new WebSocketServer({port: 947});

	// On new connection
	wss.on("connection", (ws) => wssOnconnection(ws));

	return wss;
}

function wssOnconnection(ws: WebSocket) {
	ws.on("message", (data) => {
		let req: PlaceWSRequest;
		// Try parsing data as JSON, else close WebSocket
		try {
			req = JSON.parse(data.toString());
			if (!isPlaceWSRequest(req)) {
				throw new Error();
			}
		} catch {
			ws.close(400, "Bad Request");
			return;
		}

		if (req.action == "canvas") {

		} else if (req.action == "poll") {

		} else if (req.action == "draw") {

		}
	});
}

interface PlaceWSRequest {
	action: PlaceWSRequestActions,
	coordinates?: Coordinates,
	color?: Colors
}

enum PlaceWSRequestActions {
	Info = "info",
	Canvas = "canvas",
	Poll = "poll",
	Draw = "draw"
}

function isPlaceWSRequest(obj: any): obj is PlaceWSRequest {
	if (obj.action === PlaceWSRequestActions.Canvas ||
		obj.action === PlaceWSRequestActions.Info) {
		return true;
	} else if (obj.action === PlaceWSRequestActions.Poll) {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			typeof obj.coordinates[2] === "undefined") {
			return true;
		} else {
			return false;
		}
	} else if (obj.action === PlaceWSRequestActions.Draw) {
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