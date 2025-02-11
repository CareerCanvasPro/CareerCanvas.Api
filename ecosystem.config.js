module.exports = {
  apps: [{
    name: 'server-monitor',
    script: './monitoring/index.js',
    watch: true,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    out_file: './logs/server-out.log',
    error_file: './logs/server-error.log',
    max_restarts: 10,
  }]
};