import { ResizeObserverStore } from "./resize-observer-store";

export * from "./types";

/**
 * Singleton instance of the ResizeObserverStore.
 */
const store = new ResizeObserverStore();

export const observe: ResizeObserverStore["observe"] =
	store.observe.bind(store);

export const unobserve: ResizeObserverStore["unobserve"] =
	store.unobserve.bind(store);

export const disconnect: ResizeObserverStore["disconnect"] =
	store.disconnect.bind(store);

export const snapshot: ResizeObserverStore["snapshot"] =
	store.snapshot.bind(store);
