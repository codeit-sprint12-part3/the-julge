import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  eslint.configs.recommended, // 기본 ESLint 추천 규칙
  {
    files: ["**/*.ts", "**/*.tsx"], // TypeScript 파일 검사
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      env: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": ["warm"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  prettier,
];
