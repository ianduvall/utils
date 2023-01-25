import { ResizeObserverStore } from "./resize-observer-store";
import { lazily } from "@ianduvall/lazily";

export * from "./types";

/**
 * Singleton instance of the ResizeObserverStore.
 */
export const getResizeObserverStore = lazily(() => new ResizeObserverStore());
