import { silenceLogger } from "../src/logging";
import { action_poll } from "../src/poll";

silenceLogger();

describe("poll.ts", () => {
	test("action_poll() should return WSErrorResponse when", async () => {
		expect((await action_poll([200,200])).success).toStrictEqual(false);
	});
});