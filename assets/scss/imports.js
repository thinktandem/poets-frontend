// utils.js
const path = require("path");
const resources = [
  "_boostrap-variables.scss",
  "_custom-variables.scss",
  "app.scss"
];
module.exports = resources.map(file => path.resolve(__dirname, file));
