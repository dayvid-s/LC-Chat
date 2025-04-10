module.exports = {
  apps: [
    {
      name: "LC Chat Backend",
      script: "npm",
      args: "start",
      autorestart: true,
      max_restarts: 20,
      out_file: "./logs/backend-out.log",
      error_file: "./logs/backend-error.log",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "LC Chat Monitor",
      script: "node",
      args: "monitor.js",
      watch: false,
      autorestart: true,
      max_restarts: 20,
      out_file: "./logs/monitor-out.log",
      error_file: "./logs/monitor-error.log"
    }
  ]
};
