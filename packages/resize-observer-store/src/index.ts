import { ResizeObserverStore } from "./resize-observer-store";
import { lazily } from "@ianduvall/lazily";

export * from "./types";

/**
 * Singleton instance of the ResizeObserverStore.
 */
const getStore = lazily(() => new ResizeObserverStore());

export const observe: ResizeObserverStore["observe"] = (...inputs) =>
	getStore().observe(...inputs);

export const unobserve: ResizeObserverStore["unobserve"] = (...inputs) =>
	getStore().unobserve(...inputs);

export const disconnect: ResizeObserverStore["disconnect"] = (...inputs) =>
	getStore().disconnect(...inputs);

export const snapshot: ResizeObserverStore["snapshot"] = (...inputs) =>
	getStore().snapshot(...inputs);
