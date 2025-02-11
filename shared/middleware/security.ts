import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';

export const securityMiddleware = [
  helmet(),
  xss(),
  (req: Request, res: Response, next: NextFunction) => {
    // Validate redirect URLs
    const originalRedirect = res.redirect;
    res.redirect = function (url: string) {
      const sanitizedUrl = new URL(url, req.protocol + '://' + req.get('host'));
      if (sanitizedUrl.hostname === req.hostname) {
        return originalRedirect.call(this, url);
      }
      return res.status(400).json({ error: 'Invalid redirect URL' });
    };
    next();
  }
];