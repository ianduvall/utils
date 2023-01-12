/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	extends: ["turbo", "prettier", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {},
};
