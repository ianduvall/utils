import { BoxOptionResizeObserver } from "./box-option-resize-observer";
import type { BoxOption, Callback } from "./types";

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
		boxOption: BoxOption = "content-box" as const,
	) {
		const cacheValue = this.#load(boxOption);
		cacheValue.observe(element, callback);
	}

	unobserve(
		element: Element,
		callback: Callback,
		boxOption: BoxOption = "content-box" as const,
	): void {
		const cache = this.#cache;
		const cacheValue = cache.get(boxOption);
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
		boxOption: BoxOption = "content-box" as const,
	): ResizeObserverEntry | undefined {
		return this.#cache.get(boxOption)?.get(element)?.value;
	}
}
