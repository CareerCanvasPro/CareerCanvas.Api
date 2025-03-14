module.exports = {
  apps: [
    {
      name: "Jobs Management Service",
      script: "npm",
      args: "run deploy",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      time: true,
    },
  ],
};
