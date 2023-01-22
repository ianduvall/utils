import {
	disconnect,
	observe,
	snapshot,
} from "@ianduvall/resize-observer-store";

const target = document.querySelector("#resize-me") as HTMLTextAreaElement;
const observeOnInput = document.querySelector(
	"#observe-on",
) as HTMLInputElement;
const observeOffInput = document.querySelector(
	"#observe-off",
) as HTMLInputElement;
const widthInput = document.querySelector("#width-input") as HTMLInputElement;
const paddingInput = document.querySelector(
	"#padding-input",
) as HTMLInputElement;
const display1 = document.querySelector("#content-box") as HTMLPreElement;
const display2 = document.querySelector("#border-box") as HTMLPreElement;
const display3 = document.querySelector(
	"#device-pixel-content-box",
) as HTMLPreElement;

observeOnInput.addEventListener("click", () => {
	roSubscribe();
});
observeOffInput.addEventListener("click", () => {
	roUnsubscribe();
});
widthInput.addEventListener("change", (e) => {
	const element = e.target as HTMLInputElement;
	target.style.width = `${element.value}px`;
});
paddingInput.addEventListener("change", (e) => {
	const element = e.target as HTMLInputElement;
	target.style.paddingInline = `${element.value}px`;
});

const testNative = () => {
	const ro = new ResizeObserver((entries) => {
		console.log("native ro", entries);
		for (const entry of entries) {
			display1.textContent = JSON.stringify(
				{
					boxOption: "border-box",
					blockSize: entry.borderBoxSize[0].blockSize,
					inlineSize: entry.borderBoxSize[0].inlineSize,
				},
				null,
				2,
			);
			display2.textContent = JSON.stringify(
				{
					boxOption: "content-box",
					blockSize: entry.contentBoxSize[0].blockSize,
					inlineSize: entry.contentBoxSize[0].inlineSize,
				},
				null,
				2,
			);
			display3.textContent = JSON.stringify(
				{
					boxOption: "device-pixel-content-box",
					blockSize: entry.devicePixelContentBoxSize[0].blockSize,
					inlineSize: entry.devicePixelContentBoxSize[0].inlineSize,
				},
				null,
				2,
			);
		}
	});

	// reorder these to see the difference
	ro.observe(target, { box: "content-box" });
	ro.observe(target, { box: "device-pixel-content-box" });
	ro.observe(target, { box: "border-box" });
};
// testNative();
testNative;

function subscribe(
	el: Element,
	showElement: Element,
	boxOption: ResizeObserverBoxOptions,
) {
	observe(
		el,
		() => {
			console.log("notify", boxOption);
			const entry = snapshot(el, boxOption);
			if (!entry) {
				return;
			}
			const getBoxSize = (boxSize: ResizeObserverSize) => {
				return {
					blockSize: boxSize.blockSize,
					inlineSize: boxSize.inlineSize,
				};
			};
			showElement.textContent = JSON.stringify(
				{
					boxOption,
					entry: entry
						? {
								borderBoxSize: getBoxSize(entry.borderBoxSize[0]),
								contentBoxSize: getBoxSize(entry.contentBoxSize[0]),
								devicePixelContentBoxSize: getBoxSize(
									entry.devicePixelContentBoxSize[0],
								),
								contentRect: entry.contentRect,
						  }
						: null,
				},
				null,
				2,
			);
		},
		boxOption,
	);
}

function roSubscribe() {
	subscribe(target, display1, "border-box");
	subscribe(target, display2, "content-box");
	subscribe(target, display3, "device-pixel-content-box");
}
roSubscribe();

function roUnsubscribe() {
	disconnect();
}
