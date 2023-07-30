// src/database.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { createClient } from "redis";

namespace Database {
	let client = createClient();

	async function setupClient() {
		try {
			client.on("error", err => { throw err });
			await client.connect();
		} catch (err) {

		}
	}

	export async function setKey() {
		if (!client.isReady) {
			await setupClient();
		} 
		
	}
}

export default Database;