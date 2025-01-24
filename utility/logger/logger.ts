import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";

import config from "./config/config";

export default class Logger {
  private logger: winston.Logger;
  private logGroupName: string;
  private logStreamName: string;

  constructor(
    logGroupName: string,
    logStreamBaseName: string,
    platform?: string
  ) {
    this.logGroupName = logGroupName;

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    this.logStreamName = `${logStreamBaseName}-${timestamp}-${platform}`;
    this.logger = winston.createLogger({
      format: winston.format.json(),
      level: "info",
      transports: [
        new winston.transports.Console(),
        new WinstonCloudWatch({
          awsRegion: config.aws.region,
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          messageFormatter: (log: {
            data: unknown;
            level: unknown;
            message: string;
          }): string => {
            return JSON.stringify({
              data: log.data || {},
              level: log.level,
              message: log.message,
              timestamp: new Date().toISOString(),
            });
          },
        }),
      ],
    });
  }

  info(message: string, data?: unknown): void {
    this.logger.info(message, { data });
  }

  warning(message: string, data?: unknown): void {
    this.logger.warn(message, { data });
  }

  error(message: string, data?: unknown): void {
    this.logger.error(message, { data });
  }
}
