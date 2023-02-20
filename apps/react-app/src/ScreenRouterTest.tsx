import { createRouter } from "./router";

export const ScreenRouterTest = () => {
	return (
		<details open>
			<summary>
				<h2 style={{ display: "inline-block" }}>Screen Router Test</h2>
			</summary>

			<Router.Root>
				<Content />
			</Router.Root>
		</details>
	);
};

const BackButton = (props: React.ComponentPropsWithoutRef<"button">) => (
	<button
		{...props}
		onClick={() => {
			Router.navigate(-1);
		}}
	>
		Back
	</button>
);
const routes = [
	{
		path: "root",
		component: () => {
			return (
				<div>
					<h2>Routes</h2>
					<div style={{ display: "flex", gap: "1rem" }}>
						<button
							onClick={() => {
								Router.navigate("a");
							}}
						>
							Route A
						</button>
						<button
							onClick={() => {
								// @ts-expect-error - invalid path
								Router.navigate("wrong");
								Router.navigate("x");
							}}
						>
							Route X
						</button>
					</div>
				</div>
			);
		},
	},
	{
		path: "a",
		component: () => {
			return (
				<div>
					<h3>Route A</h3>
					<BackButton />
					<div style={{ display: "flex", gap: "1rem" }}>
						<button
							onClick={() => {
								Router.navigate("a.b");
							}}
						>
							Route A.B
						</button>
					</div>
				</div>
			);
		},
	},
	{
		path: "x",
		component: () => (
			<div>
				<h3>Route X</h3>
				<BackButton />
			</div>
		),
	},
	{
		path: "a.b",
		component: () => (
			<div>
				<h3>Route A.B</h3>
				<BackButton />
			</div>
		),
	},
] as const;
const Router = createRouter({
	routes,
});

const Content = () => {
	const path = Router.usePath();

	const route = routes.find((r) => r.path === path)!;

	return (
		<div>
			<route.component />
		</div>
	);
};
