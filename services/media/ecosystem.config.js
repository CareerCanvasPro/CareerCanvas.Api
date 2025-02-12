module.exports = {
  apps: [
    {
      name: "Media Upload Service",
      script: "npm",
      args: "run deploy",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        AWSREGION_PRODUCTION: process.env.AWSREGION_PRODUCTION,
        CLIENTSECRET_PRODUCTION: process.env.CLIENT_SECRET
      }
    },
  ],
};
