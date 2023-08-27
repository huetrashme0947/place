// src/wss.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { ConfigurationKeys, checkForSpecialMode, getConfigValue } from "./configuration";

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
		duration: await getConfigValue(ConfigurationKeys.SpecialCooldown)
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
		await (await checkForSpecialMode() ? rateLimiterSpecial : rateLimiter).consume(remoteAddr, 1);
		return 0;
	} catch (res) {
		// Failed, so cooldown is active
		return (res as RateLimiterRes).msBeforeNext;
	}
}

/**
 * Returns the time remaining before the cooldown of the given user ends, or 0 if there is no active cooldown.
 * @param remoteAddr Remote address of a user
 */
export async function getRemainingTime(remoteAddr: string) {
	// Check if rate limiters are ready
	if (!rateLimiter || !rateLimiterSpecial) {
		await setupRateLimiters();
	}
	
	const res = await (await checkForSpecialMode() ? rateLimiterSpecial : rateLimiter).get(remoteAddr);
	if (!res || res.msBeforeNext == 0) return 0;
	return res.msBeforeNext;
}