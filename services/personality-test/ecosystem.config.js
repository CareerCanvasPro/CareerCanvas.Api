module.exports = {
  apps: [
    {
      name: "Personality Test Service",
      script: "npm",
      args: "run deploy",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    },
  ],
};
