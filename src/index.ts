// src/index.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer } from "ws";

async function main() {
	// Create WebSocket server
	const wss = new WebSocketServer({port: 947});
	wss.on("connection", (ws) => {
		ws.send("lol");
	});
}

main();