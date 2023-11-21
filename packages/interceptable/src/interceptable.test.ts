import assert from "node:assert";
import { describe, it } from "node:test";
import { Interceptable } from "./interceptable";

describe("Interceptable", () => {
	it("should work with promises", async () => {
		const intercepted = new Interceptable<[number], Promise<number>>({
			root: async (input) => input + 1,
			interceptors: new Set([(next) => (input) => next(input + 1)]),
		});

		assert.strictEqual(await intercepted.run(1), 3);
	});

	it("should work without promises", () => {
		const intercepted = new Interceptable<[number], number>({
			root: (input) => input + 1,
			interceptors: new Set([(next) => (input) => next(input + 1)]),
		});

		assert.strictEqual(intercepted.run(1), 3);
	});

	it("should run interceptors in FIFO order", async () => {
		const intercepted = new Interceptable<[number], number>({
			root: (input) => input + 1,
			interceptors: new Set([
				// add one
				(next) => (input) => next(input + 1),
				// double if even
				(next) => (input) => (input % 2 === 0 ? next(input * 2) : input),
			]),
		});

		assert.strictEqual(intercepted.run(0), 1);
		assert.strictEqual(intercepted.run(1), 5);
	});

	it("should allow for adding a new interceptor", async () => {
		const intercepted = new Interceptable<[number], number>({
			root: (input) => input + 1,
		});

		assert.strictEqual(intercepted.run(0), 1);

		intercepted
			.add((next) => (input) => next(input + 1))
			.add((next) => (input) => next(input + 1));

		assert.strictEqual(intercepted.run(0), 3);
	});

	it("should allow for deleting an interceptor", async () => {
		const interceptor = (next: (input: number) => number) => (input: number) =>
			next(input + 1);
		const intercepted = new Interceptable<[number], number>({
			root: (input) => input + 1,
			interceptors: new Set([interceptor]),
		});

		assert.strictEqual(intercepted.run(0), 2);

		intercepted.delete(interceptor);

		assert.strictEqual(intercepted.run(0), 1);
	});
});
