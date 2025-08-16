module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "logs/**"],
  },
  require("@eslint/js").configs.recommended,
  ...require("typescript-eslint").configs.recommended,
  require("eslint-config-prettier"),
  {
    files: ["eslint.config.js"], // allow require here
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    plugins: {
      import: require("eslint-plugin-import"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "no-console": "warn",
    },
  },
];
