import { RequestHandler } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import { redirectGuard } from './redirectGuard';
import { rateLimiter } from './rateLimit';
import { corsConfig } from './cors';
import { helmetConfig } from './helmetConfig';

export const securityMiddleware: RequestHandler[] = [
  corsConfig,
  helmetConfig,
  xss(),
  rateLimiter,
  redirectGuard
];

export * from './redirectGuard';
export * from './rateLimit';
export * from './cors';
export * from './helmetConfig';