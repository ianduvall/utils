import { BoxOptionResizeObserver } from "./box-option-resize-observer";
import type { BoxOption, Callback, Entry } from "./types";

export class ResizeObserverStore {
	#cache: Record<BoxOption, BoxOptionResizeObserver | undefined> = {
		"border-box": undefined,
		"content-box": undefined,
		"device-pixel-content-box": undefined,
	} as const;
	#defaultBoxOption: BoxOption = "content-box";

	/**
	 * Read value from cache (lazily).
	 */
	#load(boxOption: BoxOption): BoxOptionResizeObserver {
		const cache = this.#cache;
		let resizeObserver = cache[boxOption];
		if (!resizeObserver) {
			resizeObserver = new BoxOptionResizeObserver(boxOption);
			cache[boxOption] = resizeObserver;
		}
		return resizeObserver;
	}

	observe(
		element: Element,
		callback: Callback,
		boxOption: BoxOption = this.#defaultBoxOption,
	): void {
		const cacheValue = this.#load(boxOption);
		cacheValue.observe(element, callback);
	}

	unobserve(
		element: Element,
		callback: Callback,
		boxOption: BoxOption = this.#defaultBoxOption,
	): void {
		const cache = this.#cache;
		const cacheValue = cache[boxOption];
		if (!cacheValue) {
			return;
		}
		cacheValue.unobserve(element, callback);
	}

	disconnect(): void {
		const boxOptions = Object.keys(this.#cache) as BoxOption[];
		boxOptions.forEach((key) => {
			const resizeObserver = this.#cache[key];
			if (!resizeObserver) {
				return;
			}
			resizeObserver.disconnect();
			this.#cache[key] = undefined;
		});
	}

	snapshot<Elem extends Element>(
		element: Elem,
		boxOption: BoxOption = this.#defaultBoxOption,
	): Entry<Elem> | undefined {
		return this.#cache[boxOption]?.get<Elem>(element)?.value;
	}
}
