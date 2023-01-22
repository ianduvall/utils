export type Handler<Inputs extends unknown[], Output> = (
	...inputs: Inputs
) => Output;
export type Interceptor<Inputs extends unknown[], Output> = (
	next: Handler<Inputs, Output>,
) => Handler<Inputs, Output>;

export class Interceptable<Inputs extends unknown[], Output> {
	#root: Handler<Inputs, Output>;
	#rootIntercepted: Handler<Inputs, Output> | null = null;
	#interceptors: Set<Interceptor<Inputs, Output>>;

	constructor({
		root,
		interceptors,
	}: {
		root: Handler<Inputs, Output>;
		interceptors?: Set<Interceptor<Inputs, Output>>;
	}) {
		this.#root = root;
		this.#interceptors = new Set(interceptors);
	}

	get run(): Handler<Inputs, Output> {
		if (this.#rootIntercepted) {
			return this.#rootIntercepted;
		}

		// apply interceptors in reverse so they run in FIFO order
		this.#rootIntercepted = Array.from(this.#interceptors).reduceRight(
			(next, interceptor) => interceptor(next),
			this.#root,
		);

		return this.#rootIntercepted;
	}

	add(interceptor: Interceptor<Inputs, Output>): this {
		this.#rootIntercepted = null;
		this.#interceptors.add(interceptor);
		return this;
	}

	delete(interceptor: Interceptor<Inputs, Output>): boolean {
		this.#rootIntercepted = null;
		return this.#interceptors.delete(interceptor);
	}

	clone(): Interceptable<Inputs, Output> {
		return new Interceptable({
			root: this.#root,
			interceptors: this.#interceptors,
		});
	}
}
