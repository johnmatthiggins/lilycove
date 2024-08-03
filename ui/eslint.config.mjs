import globals from "globals";
import pluginJs from "@eslint/js";
import solid from "eslint-plugin-solid/configs/recommended.js";


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  solid,
];
