module.exports = {
  apps: [
    {
      name: "Personality Test Service",
      script: "npm",
      args: "run start",  // Changed from "run server" to "run start"
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        PORT: 8003,
        NODE_ENV: "production"
      }
    },
  ],
};
