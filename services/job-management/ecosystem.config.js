module.exports = {
  apps: [
    {
      args: "run server",
      // Number of instances (use 'max' for all CPU cores)
      autorestart: true,
      exec_mode: "fork",
      // Use 'cluster' if you want multiple instances
      instances: 1,
      // Set to true if you want PM2 to watch for changes
      max_memory_restart: "500M", // Restart if memory usage exceeds 500MB
      name: "Job Management Service",
      script: "npm",
      watch: false,
    },
  ],
};
