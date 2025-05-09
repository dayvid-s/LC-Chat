module.exports = {
  apps: [
    {
      name: "LC Chat Backend",
      script: "dist/server.js",
      interpreter: "node",
      interpreter_args: "--max-old-space-size=14336",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      log_file: "./logs/backend.log",
      merge_logs: true
    },
    {
      name: "LC Chat Monitor",
      script: "monitor.js",
      watch: false,
      autorestart: true
    }
  ]
};
