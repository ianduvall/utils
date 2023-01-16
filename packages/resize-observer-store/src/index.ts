import { ResizeObserverStore } from "./resize-observer-store";
import { lazily } from "@ianduvall/lazily";

export * from "./types";

/**
 * Returns the singleton instance of the ResizeObserverStore.
 * @returns ResizeObserverStore
 */
export const getResizeObserverStore = lazily<ResizeObserverStore>(
	() => new ResizeObserverStore(),
);
