export type BoxOption =
	| "border-box"
	| "content-box"
	| "device-pixel-content-box";

export type Callback = () => unknown;

export interface Entry<Elem extends Element = Element>
	extends ResizeObserverEntry {
	target: Elem;
}
