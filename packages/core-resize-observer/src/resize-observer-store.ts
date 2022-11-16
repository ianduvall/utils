import { Subscribable, type Callback } from "subscribable";

type Result = ResizeObserverEntry;
type CacheKey = Element;
interface CacheValue {
	subscriptions: Subscribable;
	entry: ResizeObserverEntry | undefined;
	updatedAt: number;
}

export class ResizeObserverStore extends Subscribable {
	#cache: WeakMap<CacheKey, CacheValue>;
	#resizeObserver: ResizeObserver;

	constructor() {
		super();
		this.#cache = new WeakMap<CacheKey, CacheValue>();
		this.#resizeObserver = new ResizeObserver(
			(entries: ResizeObserverEntry[], observer: ResizeObserver): void => {
				const cache = this.#cache;
				for (const entry of entries) {
					const result = cache.get(entry.target);
					if (!result) {
						console.error(
							`observing an element with no subscribers`,
							entry.target,
						);
						observer.unobserve(entry.target);
						continue;
					}
					result.entry = entry;
					result.subscriptions.notify();
					result.updatedAt = Date.now();
				}
			},
		);
	}

	observe<TElement extends Element>(element: TElement, callback: Callback) {
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

		const unsubscribe = result.subscriptions.subscribe(callback);

		return () => {
			this.#resizeObserver.unobserve(element);
			unsubscribe();
		};
	}

	getSnapshot<TElement extends Element>(element: TElement): Result | undefined {
		return this.#cache.get(element)?.entry;
	}
}
