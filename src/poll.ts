// src/poll.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Colors, Coordinates } from "./types";
import { Response } from "./wss";

export async function action_poll(coordinates: Coordinates) {
	const res: PollResponse = {
		success: true,
		coordinates: coordinates,
		color: Colors.White,
		timestamp: 0
	}
	
	// Get color value from database
}

interface PollResponse extends Response {
	success: true,
	coordinates: Coordinates,
	color: Colors,
	timestamp: number
}