// src/canvas.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { Database } from "./database";
import { getCurrentCanvasSize } from "./configuration";


/**
 * Returns the whole canvas as a base64 encoded string.
 */
export async function action_canvas() {
	// Get canvas size and calculate desired output buffer length
	const canvasSize = await getCurrentCanvasSize();
	const outBufLen = Math.ceil(canvasSize[0] / 2) * canvasSize[1];

	// Retrieve every row and concatenate into Buffer
	const canvasBuf = Buffer.alloc(outBufLen);
	for (let i = 0; i < canvasSize[1]; i++) {
		const rowBuf = await Database.getRow(i);
		rowBuf.copy(canvasBuf, Math.ceil(canvasSize[0] / 2) * i);
	}

	// Convert buffer to base64 encoded string
	const outStr = "canvas:" + canvasBuf.toString("base64");

	return outStr;
}