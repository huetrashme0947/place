// src/index.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { WebSocketServer } from "ws";
import { createClient } from "redis";

import { create_wss } from "./wss";

async function main() {
	const wss = create_wss();
}

main();