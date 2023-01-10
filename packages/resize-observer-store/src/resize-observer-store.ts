import { BoxOptionResizeObserver } from "./box-option-resize-observer";
import type { BoxOption } from "./types";

type Callback = () => unknown;

export class ResizeObserverStore {
	#cache: Map<BoxOption, BoxOptionResizeObserver>;

	constructor() {
		this.#cache = new Map();
	}

	/**
	 * Read value from cache (lazily).
	 */
	#load(boxOption: BoxOption): BoxOptionResizeObserver {
		const cache = this.#cache;
		let entryCache = cache.get(boxOption);
		if (!entryCache) {
			entryCache = new BoxOptionResizeObserver(boxOption);
			cache.set(boxOption, entryCache);
		}
		return entryCache;
	}

	observe(
		element: Element,
		callback: Callback,
		boxOption: BoxOption = "border-box" as const,
	) {
		console.log("observe", boxOption);
		const cacheValue = this.#load(boxOption);
		cacheValue.observe(element, callback);
	}

	unobserve(
		element: Element,
		callback: Callback,
		boxOption: BoxOption = "border-box" as const,
	): void {
		console.log("unobserve", boxOption);
		const cache = this.#cache;
		let cacheValue = cache.get(boxOption);
		if (!cacheValue) {
			return;
		}
		cacheValue.unobserve(element, callback);
	}

	disconnect(): void {
		this.#cache.forEach((cacheValue) => cacheValue.disconnect());
		this.#cache.clear();
	}

	getSnapshot(
		element: Element,
		boxOption: BoxOption,
	): ResizeObserverEntry | undefined {
		return this.#cache.get(boxOption)?.get(element)?.value;
	}
}
