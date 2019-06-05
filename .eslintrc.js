module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6
  },
  extends: [
    "google",
    "plugin:vue/strongly-recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    "prettier"
  ],
  // add your custom rules here
  rules: {
    "prettier/prettier": ["error"],
    "arrow-parens": ["error", "as-needed"],
    "camelcase": "off",
    "template-curly-spacing" : "off",
    indent : "off"
  }
}
