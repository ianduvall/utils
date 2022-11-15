import { Subscribable } from "subscribable";

type Brand<K, T> = K & { __brand: T };
const nullishObject = {} as Brand<{}, "nullishObject">;

type CacheKey = typeof nullishObject | Element;

type Result = ResizeObserverEntry;
type CacheValue = {
	subscriptions: Subscribable;
	entry: ResizeObserverEntry | undefined;
	updatedAt: number;
};

class ResizeObserverStore extends Subscribable {
	#cache: WeakMap<CacheKey, CacheValue>;
	#resizeObserver: ResizeObserver;

	constructor() {
		super();
		this.#cache = new WeakMap<CacheKey, CacheValue>();
		const resizeHandler: ResizeObserverCallback = (entries) => {
			const cache = this.#cache;
			entries.forEach((entry) => {
				const result = cache.get(entry.target);
				if (!result) {
					throw new Error(
						`observing an element ${entry.target} with no subscribers`,
					);
				}
				result.entry = entry;
				result.subscriptions.notify();
				result.updatedAt = Date.now();
			});
		};
		this.#resizeObserver = new ResizeObserver(resizeHandler);
	}

	observe<TElement extends Element>(element: TElement, callback: () => void) {
		let result: CacheValue;
		if (!this.#cache.has(element)) {
			this.#cache.set(element, {
				subscriptions: new Subscribable(),
				entry: undefined,
				updatedAt: 0,
			});
		}
		result = this.#cache.get(element)!;

		this.#resizeObserver.observe(element);
		const unobserve = () => {
			this.#resizeObserver.unobserve(element);
		};

		const unsubscribe = result.subscriptions.subscribe(callback);

		return () => {
			unobserve();
			unsubscribe();
		};
	}

	getSnapshot<TElement extends Element>(element: TElement): Result | undefined {
		return this.#cache.get(element)?.entry;
	}
}
