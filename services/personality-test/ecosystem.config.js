module.exports = {
  apps: [
    {
      name: "Personality Test Service",
      script: "npm",
      args: "run start",  // Using start instead of server for production
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    },
  ],
};
