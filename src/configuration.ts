// src/configuration.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import * as fs from "fs/promises";
import { resolve } from "path";

import { logger } from "./logging";

let configuration: { [index: string]: string };

export async function getConfigValue(key: string) {
	if (configuration === undefined) {
		try {
			let data = await fs.readFile(resolve("config.json"), "utf-8");
			configuration = JSON.parse(data);
		} catch (err) {
			logger.error(`[configuration] ${resolve("config.json")} could not be read or is not a valid JSON file.`);
			throw err;
		}
	}

	return configuration[key];
}