// utils.js
const path = require("path");
const resources = [
  "_boostrap-variables.scss",
  "_custom-variables.scss",
  "~bootstrap/scss/functions",
  "~bootstrap/scss/variables",
  "~bootstrap/scss/mixins"
];
module.exports = resources.map(file => path.resolve(__dirname, file));
