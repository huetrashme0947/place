// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";

import { WSErrorResponse, WSRequest, WSRequestActions, WSResponse } from "./types";
import { action_poll } from "./poll";
import { logger } from "./logging";
import { action_canvas } from "./canvas";
import { action_draw } from "./draw";
import { action_info } from "./info";

const clients: { [index: string]: WebSocket } = {};

function getUUID(ws: WebSocket) {
	return String(Object.keys(clients).find(key => clients[key] === ws));
}

/**
 * Creates and configures a new {@link WebSocketServer} and returns it.
 */
export function createWss() {
	// Create WebSocket server
	const wss = new WebSocketServer({port: 947});

	// On new connection
	wss.on("connection", (ws, req) => wssOnconnection(ws, req));

	return wss;
}

function wssOnconnection(ws: WebSocket, httpReq: IncomingMessage) {
	ws.on("message", async (data) => {
		let req: WSRequest;
		// Try parsing data as JSON, else return error
		try {
			req = JSON.parse(data.toString());
		} catch {
			const res: WSErrorResponse = {
				success: false,
				action: WSRequestActions.Unknown,
				error_code: 400		// 400 Bad Request
			};
			ws.send(JSON.stringify(res));
			return;
		}

		if (req.action != WSRequestActions.Canvas) {
			let res: WSResponse;
			if (req.action == WSRequestActions.Info) {
				res = await action_info((httpReq.socket.remoteAddress as string));
			} else if (req.action == WSRequestActions.Poll && req.coordinates) {
				res = await action_poll(req.coordinates);
			} else if (req.action == WSRequestActions.Draw && req.coordinates && req.color) {
				res = await action_draw(req.coordinates, req.color, (httpReq.socket.remoteAddress as string));
			} else {
				res = {
					success: false,
					action: WSRequestActions.Unknown,
					error_code: 400		// 400 Bad Request
				} as WSErrorResponse;
				req.action = WSRequestActions.Unknown;
			}

			ws.send(JSON.stringify(res));
			logger.http(`[wss] [${getUUID(ws)}] Answered "${req.action}" request (success=${res.success})`);
			return;
		} else {
			const res = await action_canvas();
			ws.send(res);
			logger.http(`[wss] [${getUUID(ws)}] Answered "${req.action}" request (success=true)`);
			return;
		}
	});

	function closeWS() {
		// Remove client from clients and log
		const uuid = getUUID(ws);
		delete clients[uuid];
		logger.http(`[wss] [${uuid}] Connection closed with ${httpReq.socket.remoteAddress}`);
	}
	ws.on("close", closeWS);
	ws.on("error", closeWS);

	// Generate client UUID and push to clients
	const uuid = uuidv4().slice(0,8);
	clients[uuid] = ws;

	logger.http(`[wss] [${uuid}] Connection established with ${httpReq.socket.remoteAddress}`);
}