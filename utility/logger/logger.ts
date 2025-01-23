import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import config from "./config/config";

export default class Logger {
  private logger: winston.Logger;
  private logGroupName: string;
  private logStreamName: string;

  constructor(logGroupName: string, logStreamBaseName: string, platform?: any) {
    this.logGroupName = logGroupName;

    
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    this.logStreamName = `${logStreamBaseName}-${timestamp}-${platform}`;
    this.logger = winston.createLogger({
      level: "info", 
      format: winston.format.json(), 
      transports: [
        new winston.transports.Console(),
        new WinstonCloudWatch({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          awsRegion: config.aws.region, 
          messageFormatter: (log) => {
            return JSON.stringify({
              level: log.level,
              message: log.message,
              data: log.data || {}, 
              timestamp: new Date().toISOString(),
            });
          },
        }),
      ],
    });
  }

  info(message: string, data?: any) {
    this.logger.info(message, { data });
  }

  warning(message: string, data?: any) {
    this.logger.warn(message, { data });
  }

  error(message: string, data?: any) {
    this.logger.error(message, { data });
  }
}
