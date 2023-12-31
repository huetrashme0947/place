// src/configuration.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import * as fs from "fs/promises";
import { resolve } from "path";
import jsonminify from "jsonminify";

import { logger } from "./logging";
import { Coordinates } from "./types";

const CONFIG_FILE = "placeconfig.jsonc";

let configuration: Configuration;

/**
 * Configuration options supported by the configuration module.
 */
export enum ConfigurationKeys {
	Startup = "startup",
	CanvasSizeStart = "canvas_size_start",
	FirstExpansion = "first_expansion",
	CanvasSizeFirstExpansion = "canvas_size_first_expansion",
	SecondExpansion = "second_expansion",
	CanvasSizeSecondExpansion = "canvas_size_second_expansion",
	SpecialModeStartup = "special_mode_startup",
	Shutdown = "shutdown",
	LogfilePath = "logfile_path",
	LogfileVerbosity = "logfile_verbosity",
	SnapshotInterval = "snapshot_interval",
	SnapshotPath = "snapshot_path",
	DrawCooldown = "draw_cooldown",
	SpecialCooldown = "special_cooldown"
}

/**
 * Represents a parsed configuration file.
 */
export interface Configuration {
	[ConfigurationKeys.Startup]: string,
	[ConfigurationKeys.CanvasSizeStart]: Coordinates,
	[ConfigurationKeys.FirstExpansion]: string,
	[ConfigurationKeys.CanvasSizeFirstExpansion]: Coordinates,
	[ConfigurationKeys.SecondExpansion]: string,
	[ConfigurationKeys.CanvasSizeSecondExpansion]: Coordinates,
	[ConfigurationKeys.SpecialModeStartup]: string,
	[ConfigurationKeys.Shutdown]: string,
	[ConfigurationKeys.LogfilePath]: string,
	[ConfigurationKeys.LogfileVerbosity]: never,
	[ConfigurationKeys.SnapshotInterval]: number,
	[ConfigurationKeys.SnapshotPath]: string,
	[ConfigurationKeys.DrawCooldown]: number,
	[ConfigurationKeys.SpecialCooldown]: number
}

/**
 * Returns the value of the specified configuration option.
 * @param key The configuration option to be returned
 */
export async function getConfigValue<K extends keyof Configuration>(key: K): Promise<Configuration[K]> {
	// Check if configuration is ready, wait if not
	if (configuration === undefined) {
		await readConfigFile();
	}

	return configuration[key];
}

/**
 * Returns the current size of the canvas.
 */
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

/**
 * Returns whether Special mode is currently in force, meaning that only Colors.Special0 and Colors.Special1 tiles can be drawn.
 */
export async function checkForSpecialMode() {
	return Date.now() >= Date.parse(String(await getConfigValue(ConfigurationKeys.SpecialModeStartup)));
}

/**
 * Reads the configuration file into memory.
 */
async function readConfigFile() {
	try {
		// Read file and parse JSON data
		const data = await fs.readFile(resolve(CONFIG_FILE), "utf-8");
		configuration = JSON.parse(jsonminify(data));
	} catch (err) {
		// Log error and throw exception if failed
		logger.error(`[configuration] ${resolve(CONFIG_FILE)} could not be read or is not a valid JSON file.`);
		throw err;
	}
}