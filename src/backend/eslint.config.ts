// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  [
    // eslint (default)
    {
      rules: {
        camelcase: "warn",
        "consistent-return": "warn",
        "dot-notation": "warn",
        "no-inline-comments": "warn",
        "no-lonely-if": "warn",
        "no-nested-ternary": "warn",
        "no-var": "warn",
        "prefer-object-has-own": "warn",
        radix: "warn",
        "require-await": "warn",
        "no-eval": "warn",
        "no-continue": "warn",
        eqeqeq: ["warn", "always", { null: "ignore" }],
        "no-restricted-syntax": [
          "warn",
          {
            selector:
              "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace)$/]",
            message:
              "log() is not recommended, use info(), error() or something else.",
          },
        ],
        "one-var": [
          "warn",
          {
            initialized: "never",
            uninitialized: "consecutive",
          },
        ],
        curly: "warn",
      },
    },
    // @typescript-eslint
    {
      rules: {
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-floating-promises": [
          "error",
          { checkThenables: true },
        ],
        "@typescript-eslint/explicit-function-return-type": "warn",
      },
    },
  ],
);

