export const lazily = <Output>(
	create: () => Output,
): {
	(): Output;
	clear(): void;
} => {
	let value: Output | undefined;

	const factory = (): Output => {
		if (value === undefined) {
			value = create();
		}

		return value;
	};

	factory.clear = (): void => {
		value = undefined;
	};

	return factory;
};
