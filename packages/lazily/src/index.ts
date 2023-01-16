export const lazily = <Output>(create: () => Output): (() => Output) => {
	let value: Output | undefined;

	return function factory(): Output {
		if (value === undefined) {
			value = create();
		}

		return value;
	};
};
