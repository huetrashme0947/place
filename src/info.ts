// src/info.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { ConfigurationKeys, getConfigValue, getCurrentCanvasSize } from "./configuration";
import { getRemainingTime } from "./cooldown";
import { Coordinates, WSRequestActions, WSSuccessResponse } from "./types";

/**
 * Returns a response containing information about the current state of the canvas and the server.
 * @param remoteAddr Remote address of a user
 */
export async function action_info(remoteAddr: string): Promise<WSInfoResponse> {
	return {
		success: true,
		action: WSRequestActions.Info,
		canvas_size: await getCurrentCanvasSize(),
		cooldown_remaining: await getRemainingTime(remoteAddr),
		special_mode_startup: await getConfigValue(ConfigurationKeys.SpecialModeStartup),
		shutdown: await getConfigValue(ConfigurationKeys.Shutdown)
	};
}

interface WSInfoResponse extends WSSuccessResponse {
	action: WSRequestActions.Info
	canvas_size: Coordinates,
	cooldown_remaining: number,
	special_mode_startup: string,
	shutdown: string
}