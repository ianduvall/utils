export type Callback = () => unknown;

export class Subscribable {
	#subscriptions: Set<Callback>;

	constructor() {
		this.#subscriptions = new Set<Callback>();
	}

	subscribe(callback: Callback): this {
		this.#subscriptions.add(callback);
		return this;
	}

	unsubscribe(callback: Callback): boolean {
		return this.#subscriptions.delete(callback);
	}

	notify(): void {
		this.#subscriptions.forEach((callback) => {
			callback();
		});
	}

	get size(): number {
		return this.#subscriptions.size;
	}
}
