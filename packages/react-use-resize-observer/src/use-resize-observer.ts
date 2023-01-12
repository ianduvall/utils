import { ResizeObserverStore } from "@ianduvall/resize-observer-store";
import { useCallback, useMemo, useState } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

// lazily initialize ResizeObserverStore singleton
let store: ResizeObserverStore | undefined;
const getResizeObserverStore = () => {
	if (!store) {
		store = new ResizeObserverStore();
	}
	return store;
};

type BoxOption = "border-box" | "content-box" | "device-pixel-content-box";

const identity = <Input>(input: Input): Input => input;

export const useResizeObserver = <Selection = ResizeObserverEntry | undefined>({
	box = "content-box" as const,
	selector = identity as (entry: ResizeObserverEntry | undefined) => Selection,
	isEqual,
}: {
	box?: BoxOption;
	selector?: (entry: ResizeObserverEntry | undefined) => Selection;
	isEqual?: (a: Selection, b: Selection) => boolean;
} = {}) => {
	const [element, setElement] = useState<Element | null>(null);
	const refCallback = useCallback((node: Element | null) => {
		setElement(node);
	}, []);

	const subscribe = useCallback(
		(onStoreChanged: () => void) => {
			if (!element) {
				return function elementIsNull() {
					return;
				};
			}
			const store = getResizeObserverStore();
			store.observe(element, onStoreChanged, box);

			return function unsubscribe() {
				store.unobserve(element, onStoreChanged, box);
			};
		},
		[element, box],
	);

	const getSnapshot = useCallback(() => {
		if (!element) {
			return;
		}

		const store = getResizeObserverStore();
		return store.getSnapshot(element, box);
	}, [box, element]);

	const selection = useSyncExternalStoreWithSelector<
		ResizeObserverEntry | undefined,
		Selection
	>(subscribe, getSnapshot, undefined, selector, isEqual);

	return useMemo(
		() => [refCallback, selection] as const,
		[refCallback, selection],
	);
};
