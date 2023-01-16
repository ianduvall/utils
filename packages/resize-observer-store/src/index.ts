import { ResizeObserverStore } from "./resize-observer-store";
import { lazily } from "@ianduvall/lazily";

/**
 * Returns the singleton instance of the ResizeObserverStore.
 * @returns ResizeObserverStore
 */
export const getResizeObserverStore = lazily<ResizeObserverStore>(
	() => new ResizeObserverStore(),
);
