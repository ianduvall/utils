import { useResizeObserver } from "@ianduvall/react-resize-observer-store";
import "./App.css";

const selector = (entry: ResizeObserverEntry | undefined) => {
	if (!entry) return undefined;
	const { blockSize, inlineSize } = entry.contentBoxSize[0];
	return { blockSize, inlineSize };
};

function App() {
	const [ref, selection] = useResizeObserver({
		selector,
	});
	console.log(selection);

	return (
		<>
			<div>
				<pre>
					<code>{JSON.stringify(selection, null, 2)}</code>
				</pre>
			</div>

			<textarea ref={ref} />
		</>
	);
}

export default App;
