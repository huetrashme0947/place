// tests/poll.test.ts
// Huechan /place/ Backend
// (c) 2023 HUE_TrashMe

import { silenceLogger } from "../src/logging";
import { Coordinates } from "../src/types";
import { action_poll } from "../src/poll";
import * as configuration from "../src/configuration";
import { Database } from "../src/database";

// Prevent the called functions from logging while testing
silenceLogger();

describe("action_poll()", () => {
	it("returns the correct color and timestamp", async () => {
		// Mock getCurrentCanvasSize() to return [100,100]
		const getCurrentCanvasSizeMock = jest.spyOn(configuration, "getCurrentCanvasSize");
		getCurrentCanvasSizeMock.mockImplementation(async () => [100,100] as Coordinates);

		// Mock Database.getTile() to return 15
		const getTileMock = jest.spyOn(Database, "getTile");
		getTileMock.mockImplementation(async () => 15);

		// Mock Database.getDrawTimestamp() to return 01/01/2000
		const timestamp = Date.parse("2000-01-01");
		const getDrawTimestampMock = jest.spyOn(Database, "getDrawTimestamp");
		getDrawTimestampMock.mockImplementation(async () => timestamp);

		const res = await action_poll([0,0]);
		expect(res.success).toStrictEqual(true);
		expect(res.success ? res.color : undefined).toStrictEqual(15);
		expect(res.success ? res.timestamp : undefined).toStrictEqual(timestamp);

		// Restore mocks
		getCurrentCanvasSizeMock.mockRestore();
		getTileMock.mockRestore();
		getDrawTimestampMock.mockRestore();
		return;
	});

	it("fails if given coordinates are bigger than canvas size", async () => {
		// Mock getCurrentCanvasSize() to return [1,1]
		const getCurrentCanvasSizeMock = jest.spyOn(configuration, "getCurrentCanvasSize");
		getCurrentCanvasSizeMock.mockImplementation(async () => [1,1] as Coordinates);

		expect((await action_poll([0,1])).success).toStrictEqual(false);
		expect((await action_poll([0,2])).success).toStrictEqual(false);
		expect((await action_poll([1,0])).success).toStrictEqual(false);
		expect((await action_poll([1,1])).success).toStrictEqual(false);
		expect((await action_poll([1,2])).success).toStrictEqual(false);
		expect((await action_poll([2,0])).success).toStrictEqual(false);
		expect((await action_poll([2,1])).success).toStrictEqual(false);
		expect((await action_poll([2,2])).success).toStrictEqual(false);

		// Restore mocks
		getCurrentCanvasSizeMock.mockRestore();
		return;
	});
});