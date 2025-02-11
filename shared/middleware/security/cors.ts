import cors from 'cors';

export const corsConfig = cors({
  origin: ['https://careercanvas.pro', 'https://www.careercanvas.pro'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
});