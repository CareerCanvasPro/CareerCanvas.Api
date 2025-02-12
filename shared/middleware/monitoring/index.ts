import { Request, Response, NextFunction } from 'express';
import os from 'os';

export const serverMonitor = (req: Request, res: Response, next: NextFunction) => {
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

  req.serverStats = stats;
  next();
};

export const healthCheck = (req: Request, res: Response) => {
  const stats = req.serverStats || {
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
  
  res.json(stats);
};