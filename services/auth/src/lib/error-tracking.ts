import * as Sentry from '@sentry/node';

export const initErrorTracking = () => {
  if (process.env.STAGE === 'prod') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.STAGE,
      tracesSampleRate: 0.1  // Cost-effective sampling
    });
  }
};