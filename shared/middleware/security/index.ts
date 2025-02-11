import { RequestHandler } from 'express';
import xss from 'xss-clean';
import { redirectGuard } from './redirectGuard';
import { helmetConfig } from './helmetConfig';

export const securityMiddleware: RequestHandler[] = [
  helmetConfig,
  xss(),
  redirectGuard
];

export * from './redirectGuard';
export * from './helmetConfig';