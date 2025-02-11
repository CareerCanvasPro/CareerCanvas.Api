import { Request, Response, NextFunction } from 'express';

export const redirectGuard = (req: Request, res: Response, next: NextFunction) => {
  const originalRedirect = res.redirect;
  res.redirect = function (url: string) {
    try {
      const sanitizedUrl = new URL(url, req.protocol + '://' + req.get('host'));
      if (sanitizedUrl.hostname === req.hostname) {
        return originalRedirect.call(this, url);
      }
      return res.status(400).json({ error: 'Invalid redirect URL' });
    } catch (error) {
      return res.status(400).json({ error: 'Malformed URL' });
    }
  };
  next();
};