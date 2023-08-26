// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { ConfigurationKeys, checkForAlbaniaMode, getConfigValue } from "./configuration";

let rateLimiter: RateLimiterMemory, rateLimiterSpecial: RateLimiterMemory;

/**
 * Initializes the rate limiters.
 */
async function setupRateLimiters() {
	rateLimiter = new RateLimiterMemory({
		points: 1,
		duration: await getConfigValue(ConfigurationKeys.DrawCooldown)
	});
	rateLimiterSpecial = new RateLimiterMemory({
		points: 1,
		duration: await getConfigValue(ConfigurationKeys.AlbaniaCooldown)
	});
}

/**
 * Attempts to start the cooldown for the given remote address.
 * @param remoteAddr Remote address of a user
 * @returns The number of milliseconds remaining, if the cooldown is already active. 0, if the cooldown has been started.
 */
export async function startCooldown(remoteAddr: string) {
	// Check if rate limiters are ready
	if (!rateLimiter || !rateLimiterSpecial) {
		await setupRateLimiters();
	}

	// Try consuming 1 point
	try {
		await (await checkForAlbaniaMode() ? rateLimiterSpecial : rateLimiter).consume(remoteAddr, 1);
		return 0;
	} catch (res) {
		// Failed, so cooldown is active
		return (res as RateLimiterRes).msBeforeNext;
	}
}