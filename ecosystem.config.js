const pshconfig = require("platformsh-config").config();

// Set defaults, these assume a dev context
const defaults = {
  port: process.env.PORT || 80,
  host: process.env.HOST || "0.0.0.0"
};

module.exports = {
  apps: [
    {
      name: "prod",
      script: "./node_modules/nuxt/bin/nuxt-start",
      autorestart: true,
      watch: false,
      max_memory_restart: "8G",
      env: {
        PORT: pshconfig.inRuntime() ? pshconfig.port : defaults.port
      }
    }
  ]
};
