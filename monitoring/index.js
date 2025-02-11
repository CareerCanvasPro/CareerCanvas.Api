const os = require('os');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: './logs/server-error.log', level: 'error' }),
    new transports.File({ filename: './logs/server-out.log' })
  ]
});

function monitorServer() {
  const stats = {
    cpuUsage: os.loadavg(),
    memoryUsage: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    },
    uptime: os.uptime(),
    timestamp: new Date().toISOString()
  };

  logger.info('Server stats', stats);

  if (stats.memoryUsage.used > 0.9 * stats.memoryUsage.total) {
    logger.error('High memory usage detected', stats.memoryUsage);
  }
}

setInterval(monitorServer, 60000); // Monitor every minute
monitorServer(); // Initial check