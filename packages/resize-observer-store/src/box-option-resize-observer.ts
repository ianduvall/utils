import { SubscribableEntry } from "./subscribable-entry";
import type { BoxOption, Callback } from "./types";

export class BoxOptionResizeObserver {
	#boxOption: BoxOption;
	#entryCache: WeakMap<Element, SubscribableEntry<Element>>;
	#resizeObserver: ResizeObserver;

	constructor(boxOption: ResizeObserverBoxOptions) {
		this.#boxOption = boxOption;
		this.#entryCache = new WeakMap();
		this.#resizeObserver = new ResizeObserver(
			(entries: ResizeObserverEntry[], observer: ResizeObserver): void => {
				const cache = this.#entryCache;
				for (const entry of entries) {
					const entryCacheValue = cache.get(entry.target);
					if (!entryCacheValue) {
						console.error(
							`observing an element with no subscribers`,
							entry.target,
						);
						observer.unobserve(entry.target);
						continue;
					}
					entryCacheValue.value = entry;
				}
			},
		);
	}

	// observer
	observe(target: Element, callback: Callback): void {
		const entryCache = this.#entryCache;
		let entry = entryCache.get(target);
		if (!entry) {
			entry = new SubscribableEntry();
			entryCache.set(target, entry);
			this.#resizeObserver.observe(target, { box: this.#boxOption });
		}

		entry.subscribe(callback);
	}
	unobserve(target: Element, callback: Callback): void {
		const entryCache = this.#entryCache;
		const entry = entryCache.get(target);
		if (!entry) {
			return;
		}
		entry.unsubscribe(callback);
		if (entry.size === 0) {
			this.#resizeObserver.unobserve(target);
			entryCache.delete(target);
		}
	}
	disconnect(): void {
		this.#resizeObserver.disconnect();
	}

	// element->entry cache
	has(element: Element): boolean {
		return this.#entryCache.has(element);
	}
	get<Elem extends Element>(
		element: Elem,
	): SubscribableEntry<Elem> | undefined {
		return this.#entryCache.get(element) as SubscribableEntry<Elem> | undefined;
	}
	set<Elem extends Element>(
		element: Elem,
		value: SubscribableEntry<Elem>,
	): this {
		this.#entryCache.set(element, value);
		return this;
	}
	delete(element: Element): boolean {
		return this.#entryCache.delete(element);
	}
}
