import { defineConfig } from "tsup";

export default defineConfig({
	name: "resize-observer-store",

	clean: true,
	dts: true,
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	minify: true,
	platform: "browser",
	sourcemap: true,
	target: "es2020",
});
