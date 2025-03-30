import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"semi": ["error", "always"],
			"quotes": ["error", "double"],
			"indent": ["error", "tab", { SwitchCase: 1 }],
			"brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"curly": ["error", "multi-line", "consistent"],
			"object-curly-spacing": ["error", "always"],
			"space-before-blocks": "error",
			"space-before-function-paren": ["error", {
				anonymous: "never",
				named: "never",
				asyncArrow: "always",
			}],
			"space-in-parens": "error",
			"space-infix-ops": "error",
			"space-unary-ops": "error",
			"spaced-comment": "error",
			"comma-dangle": ["error", "always-multiline"],
			"comma-spacing": "error",
			"comma-style": "error",
			"dot-location": ["error", "property"],
			"no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
			"no-trailing-spaces": ["error"],
		},
	},
];

export default eslintConfig;
