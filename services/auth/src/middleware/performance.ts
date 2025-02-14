import { performance } from 'perf_hooks';
import { MetricUnit } from '@aws-lambda-powertools/metrics';

export const trackPerformance = (name: string) => {
  const start = performance.now();
  return {
    end: () => {
      if (Math.random() < 0.1) { // Sample 10% of requests
        const duration = performance.now() - start;
        // Log metric
      }
    }
  };
};