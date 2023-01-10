import { Subscribable, type Callback } from "subscribable";

export interface SizeValue {
	blockSize: number;
	inlineSize: number;
}
export class Size extends Subscribable {
	#value: SizeValue | undefined;

	constructor() {
		super();
		this.#value = undefined;
	}

	#isEqual(a: SizeValue | undefined, b: SizeValue | undefined) {
		return a?.blockSize === b?.blockSize && a?.inlineSize === b?.inlineSize;
	}

	get value() {
		return this.#value;
	}

	set value(next: SizeValue | undefined) {
		const prev = this.#value;
		if (this.#isEqual(prev, next)) {
			return;
		}

		this.#value = {
			blockSize: next?.blockSize ?? 0,
			inlineSize: next?.inlineSize ?? 0,
		};
		this.notify();
	}
}
