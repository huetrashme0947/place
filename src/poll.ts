// src/poll.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates } from "./types";

async function action_poll(coordinates: Coordinates) {
	// Check if coordinates are actually valid
	
}

interface PlaceWSPollResponse {
	coordinates: Coordinates,
	color: Colors,
	timestamp: number
}