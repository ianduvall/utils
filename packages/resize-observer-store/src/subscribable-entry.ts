import { Subscribable } from "subscribable";

export class SubscribableEntry extends Subscribable {
	#value: ResizeObserverEntry | undefined;

	constructor() {
		super();
	}

	get value() {
		return this.#value;
	}

	set value(next: ResizeObserverEntry | undefined) {
		this.#value = next;
		this.notify();
	}
}
