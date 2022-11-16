export type Callback = () => any;

export class Subscribable {
	protected subscriptions: Set<Callback>;

	constructor() {
		this.subscriptions = new Set<Callback>();
	}

	subscribe(callback: Callback): () => void {
		this.subscriptions.add(callback);
		const unsubscribe = () => {
			this.subscriptions.delete(callback);
		};
		return unsubscribe;
	}

	notify(): void {
		this.subscriptions.forEach((callback) => {
			callback();
		});
	}
}
