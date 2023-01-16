export type { Callback } from "@ianduvall/subscribable";

export type BoxOption =
	| "border-box"
	| "content-box"
	| "device-pixel-content-box";

export interface Entry<Elem extends Element = Element>
	extends ResizeObserverEntry {
	target: Elem;
}
