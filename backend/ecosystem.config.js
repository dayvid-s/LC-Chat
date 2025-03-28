module.exports = {
  apps: [
    {
      name: "LC Chat Backend",
      script: "npm",
      args: "start",
      watch: true,
      autorestart: false,
      env: {
        NODE_ENV: "production"
      },
      log_file: "./logs/backend.log",
      merge_logs: true
    },
    {
      name: "LC Chat Monitor",
      script: "node",
      args: "monitor.js",
      watch: false,
      autorestart: true
    }
  ]
};
