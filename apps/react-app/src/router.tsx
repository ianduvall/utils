import { useSyncExternalStore } from "use-sync-external-store/shim";
import { Subscribable } from "@ianduvall/subscribable";
import React from "react";

interface Route<TPath extends string = string> {
	path: TPath;
	component: <Props>(props: Props) => JSX.Element;
}
interface RouterOptions<TPath extends string = string> {
	routes: readonly Route<TPath>[];
	initialEntries?: TPath[];
	initialIndex?: number;
}
interface RouteState<TPath extends string = string> {
	route: Route<TPath>;
}

interface History<TEntry> {
	currentIndex: number;
	entries: TEntry[];
}

class HistoryStore<TEntry extends string = string> extends Subscribable {
	initialState: History<TEntry>;
	state: History<TEntry>;

	constructor(initialState: History<TEntry>) {
		super();
		this.initialState = initialState;
		this.state = initialState;
	}

	get value() {
		return this.state;
	}

	update(
		updater: History<TEntry> | ((state: History<TEntry>) => History<TEntry>),
	) {
		const newState =
			typeof updater === "function" ? updater(this.state) : updater;
		if (newState === this.state) return;
		console.log("history updated", newState, this.state);
		this.state = newState;
		this.notify();
	}

	reset() {
		this.update(this.initialState);
	}

	navigate(to: TEntry | number) {
		const { currentIndex, entries } = this.state;
		if (typeof to === "number") {
			if (
				to === 0 ||
				to + currentIndex > entries.length ||
				to + currentIndex < 0
			) {
				return;
			}

			this.update((state) => {
				return {
					...state,
					currentIndex: this.state.currentIndex + to,
				};
			});
			return;
		}

		this.update((state): History<TEntry> => {
			const newEntries =
				// drop any forward entries
				state.entries.slice(0, state.currentIndex + 1);
			newEntries.push(to);
			return {
				...state,
				entries: newEntries,
				currentIndex: newEntries.length - 1,
			};
		});
	}
}

export const createRouter = <TPath extends string = string>(
	options: RouterOptions<TPath>,
) => {
	const initialIndex = options.initialIndex ?? 0;
	const initialPath = options.routes[initialIndex].path;
	const initialEntries = options.initialEntries ?? [initialPath];
	const initialHistory: History<TPath> = {
		currentIndex: initialIndex,
		entries: initialEntries,
	};
	const historyStore = new HistoryStore<TPath>(initialHistory);

	const statesByPath = new Map<TPath, RouteState<TPath>>(
		options.routes.map((route) => [route.path, { route }]),
	);
	const getCurrentPath = (history: History<TPath>) =>
		history.entries[history.currentIndex];

	const subscribe = (callback: () => void) => {
		historyStore.subscribe(callback);
		return () => historyStore.unsubscribe(callback);
	};
	const getSnapshot = () => historyStore.value;

	const useHistory = () => {
		return useSyncExternalStore(subscribe, getSnapshot);
	};

	const PathContext = React.createContext<TPath>(initialPath);
	const Root = ({
		children,
	}: React.PropsWithChildren<Record<never, never>>) => {
		const history = useHistory();

		const currentPath = getCurrentPath(history);

		return (
			<PathContext.Provider value={currentPath}>
				{children}
			</PathContext.Provider>
		);
	};

	const navigate: typeof historyStore.navigate = (to) => {
		if (typeof to === "number" || statesByPath.has(to)) {
			historyStore.navigate(to);
		}
	};

	const usePath = () => React.useContext(PathContext);

	return {
		Root,
		navigate,
		usePath,
	};
};
