import { Subscribable } from "@ianduvall/subscribable";
import type { Entry } from "./types";

export class SubscribableEntry<Elem extends Element> extends Subscribable {
	#value: Entry<Elem> | undefined;

	constructor() {
		super();
	}

	get value() {
		return this.#value;
	}

	set value(next: Entry<Elem> | undefined) {
		if (Object.is(this.#value, next)) {
			return;
		}

		this.#value = next;
		this.notify();
	}
}
