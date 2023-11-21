import { useCallback, useMemo, useState } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
import {
	getResizeObserverStore,
	type Entry,
	type BoxOption,
} from "@ianduvall/resize-observer-store";

export type { Entry, BoxOption } from "@ianduvall/resize-observer-store";

export type Selector<Elem extends Element, Selection> = (
	entry: Entry<Elem>,
) => Selection;
export type IsEqual<Selection> = (a: Selection, b: Selection) => boolean;

export const useResizeObserver = <
	Elem extends Element,
	Selection = Entry<Elem>,
>({
	box = "content-box" as const,
	selector,
	isEqual,
}: {
	box?: BoxOption;
	selector?: Selector<Elem, Selection>;
	isEqual?: IsEqual<Selection>;
} = {}): readonly [(el: Elem | null) => void, Selection | undefined] => {
	const [element, setElement] = useState<Elem | null>(null);
	const refCallback = setElement;

	const subscribe = useCallback(
		(onStoreChanged: () => void) => {
			if (!element) {
				const elementIsNull = () => {
					return;
				};
				return elementIsNull;
			}

			getResizeObserverStore().observe(element, onStoreChanged, box);

			const unsubscribe = () => {
				getResizeObserverStore().unobserve(element, onStoreChanged, box);
			};
			return unsubscribe;
		},
		[element, box],
	);

	const getSnapshot = useCallback(() => {
		if (!element) {
			return;
		}

		return getResizeObserverStore().snapshot(element, box);
	}, [box, element]);

	/**
	 * Wrap selector to prevent it from being called with undefined.
	 */
	const selectorWrapper = useCallback(
		(entry: Entry<Elem> | undefined) => {
			if (!entry) {
				return;
			}
			return selector?.(entry);
		},
		[selector],
	);

	/**
	 * Wrap isEqual to prevent it from being called with undefined.
	 */
	const isEqualWrapper = useMemo(() => {
		if (!isEqual) {
			return;
		}
		return (a: Selection | undefined, b: Selection | undefined) => {
			if (a === undefined || b === undefined) {
				return Object.is(a, b);
			}
			return isEqual(a, b);
		};
	}, [isEqual]);

	const selection = useSyncExternalStoreWithSelector<
		Entry<Elem> | undefined,
		Selection | undefined
	>(subscribe, getSnapshot, undefined, selectorWrapper, isEqualWrapper);

	return useMemo(
		() => [refCallback, selection] as const,
		[refCallback, selection],
	);
};
