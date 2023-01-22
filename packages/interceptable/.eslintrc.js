/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	$schema: "http://json.schemastore.org/eslintrc",
	root: true,
	extends: ["custom"],
	overrides: [
		{
			files: ["*test.ts"],
			env: {
				node: true,
			},
		},
	],
};
