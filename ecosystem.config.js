module.exports = {
  apps: [
    {
      name: "Backend Api",
      script: "lerna",
      args: "run start",
      exec_mode: "fork", // Use 'cluster' if you want multiple instances
      instances: 1, // Number of instances (use 'max' for all CPU cores)
      autorestart: true,
      watch: false, // Set to true if you want PM2 to watch for changes
      max_memory_restart: "500M", // Restart if memory usage exceeds 500MB
      env: {
        NODE_ENV: "production",
        PORT: 8080, // Change as per your application
      },
    },
  ],
};
