// src/configuration.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import * as fs from "fs/promises";
import { resolve } from "path";

import { logger } from "./logging";
import { Coordinates } from "./types";

const CONFIG_FILE = "config.jsonc";

let configuration: Configuration;

enum ConfigurationKeys {
	Startup = "startup",
	CanvasSizeStart = "canvas_size_start",
	FirstExpansion = "first_expansion",
	CanvasSizeFirstExpansion = "canvas_size_first_expansion",
	SecondExpansion = "second_expansion",
	CanvasSizeSecondExpansion = "canvas_size_second_expansion",
	AlbaniaModeStartup = "albania_mode_startup",
	Shutdown = "shutdown",
	SnapshotInterval = "snapshot_interval",
	DrawCooldown = "draw_cooldown",
	AlbaniaCooldown = "albania_cooldown"
}

interface Configuration {
	[ConfigurationKeys.Startup]: string,
	[ConfigurationKeys.CanvasSizeStart]: Coordinates,
	[ConfigurationKeys.FirstExpansion]: string,
	[ConfigurationKeys.CanvasSizeFirstExpansion]: Coordinates,
	[ConfigurationKeys.SecondExpansion]: string,
	[ConfigurationKeys.CanvasSizeSecondExpansion]: Coordinates,
	[ConfigurationKeys.AlbaniaModeStartup]: string,
	[ConfigurationKeys.Shutdown]: string,
	[ConfigurationKeys.SnapshotInterval]: number,
	[ConfigurationKeys.DrawCooldown]: number,
	[ConfigurationKeys.AlbaniaCooldown]: number
}

export async function getConfigValue<K extends keyof Configuration>(key: K): Promise<Configuration[K]> {
	// Check if configuration is ready, wait if not
	if (configuration === undefined) {
		await readConfigFile();
	}

	return configuration[key];
}

export async function getCurrentCanvasSize() {
	if (Date.now() < Date.parse(String(await getConfigValue(ConfigurationKeys.FirstExpansion)))) {
		// Current time is before first_expansion, so return canvas_size_start
		return await getConfigValue(ConfigurationKeys.CanvasSizeStart);
	} else if (Date.now() < Date.parse(String(await getConfigValue(ConfigurationKeys.SecondExpansion)))) {
		// Current time is before second_expansion, so return canvas_size_first_expansion
		return await getConfigValue(ConfigurationKeys.CanvasSizeFirstExpansion);
	} else {
		// Current time is after or equal to second_expansion, so return canvas_size_second_expansion
		return await getConfigValue(ConfigurationKeys.CanvasSizeSecondExpansion);
	}
}

export async function checkForAlbaniaMode() {
	return Date.now() >= Date.parse(String(await getConfigValue(ConfigurationKeys.AlbaniaModeStartup)));
}

async function readConfigFile() {
	try {
		// Read file and parse JSON data
		let data = await fs.readFile(resolve(CONFIG_FILE), "utf-8");
		configuration = JSON.parse(data);
	} catch (err) {
		// Log error and throw exception if failed
		logger.error(`[configuration] ${resolve(CONFIG_FILE)} could not be read or is not a valid JSON file.`);
		throw err;
	}

	logger.info("[configuration] Ready");
}