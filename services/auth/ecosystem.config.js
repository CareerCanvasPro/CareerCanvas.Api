module.exports = {
  apps: [
    {
      name: "Auth Service",
      script: "npm",
      args: "run server",
      exec_mode: "fork", // Use 'cluster' if you want multiple instances
      instances: 1, // Number of instances (use 'max' for all CPU cores)
      autorestart: true,
      watch: false, // Set to true if you want PM2 to watch for changes
      max_memory_restart: "500M", // Restart if memory usage exceeds 500MB
    },
  ],
};
