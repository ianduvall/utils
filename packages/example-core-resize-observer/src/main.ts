import { ResizeObserverStore } from "core-resize-observer";

const app = document.getElementById("app")!;
const display = document.createElement("pre");
const target = document.createElement("textarea");

app.appendChild(display);
app.appendChild(target);

const roStore = new ResizeObserverStore();
roStore.observe(target, () => {
	const snapshot = roStore.getSnapshot(target)!;
	const getSize = (size: ResizeObserverSize) => ({
		blockSize: size.blockSize,
		inlineSize: size.inlineSize,
	});
	display.textContent = JSON.stringify(
		{
			contentRect: snapshot.contentRect,
			borderBoxSize: getSize(snapshot.borderBoxSize[0]),
			contentBoxSize: getSize(snapshot.contentBoxSize[0]),
			devicePixelContentBoxSize: getSize(snapshot.devicePixelContentBoxSize[0]),
		},
		null,
		2,
	);
});
