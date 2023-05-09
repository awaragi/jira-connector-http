module.exports = {
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest"
  },
  extends: [
    "standard",
    "plugin:prettier/recommended"
  ],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {}
};
