import { useCallback } from "react";
import {
	useResizeObserver,
	type Entry,
} from "@ianduvall/react-resize-observer-store";

export const ResizeObserverTest = () => {
	const selector = useCallback((entry: Entry | undefined) => {
		if (!entry) return undefined;
		const boxSize = entry.borderBoxSize[0];
		return {
			blockSize: boxSize.blockSize,
			inlineSize: boxSize.inlineSize,
		};
	}, []);
	const isEqual = useCallback((a: ReturnType<typeof selector>, b: typeof a) => {
		if (!a || !b) return false;
		return a.blockSize === b.blockSize && a.inlineSize === b.inlineSize;
	}, []);
	const [ref, selection] = useResizeObserver({
		box: "border-box",
		selector,
		isEqual,
	});
	console.log(selection);

	return (
		<details>
			<summary>
				<h2 style={{ display: "inline-block" }}>Resize Observer Test</h2>
			</summary>

			<div>
				<pre>
					<code>{JSON.stringify(selection, null, 2)}</code>
				</pre>
			</div>

			<textarea ref={ref} />
		</details>
	);
};
