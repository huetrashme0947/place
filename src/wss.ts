// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer, WebSocket } from "ws";

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
	action: string,
	coordinates?: readonly [x: number, y: number],
	color?: number
}

function isPlaceWSRequest(obj: any): obj is PlaceWSRequest {
	if (obj.action === "canvas") {
		return true;
	} else if (obj.action === "poll") {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			obj.coordinates[0] >= 0 && obj.coordinates[0] <= 199 &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			obj.coordinates[1] >= 0 && obj.coordinates[1] <= 199 &&
			typeof obj.coordinates[2] === "undefined") {
			return true;
		} else {
			return false;
		}
	} else if (obj.action === "draw") {
		if (Number(obj.coordinates[0]) === obj.coordinates[0] &&
			obj.coordinates[0] >= 0 && obj.coordinates[0] <= 199 &&
			Number(obj.coordinates[1]) === obj.coordinates[1] &&
			obj.coordinates[1] >= 0 && obj.coordinates[1] <= 199 &&
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