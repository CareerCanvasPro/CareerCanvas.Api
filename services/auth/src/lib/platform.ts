export type Platform = 'web' | 'ios' | 'android';

export const detectPlatform = (userAgent?: string): Platform => {
  if (!userAgent) return 'web';

  const ua = userAgent.toLowerCase();
  if (ua.includes('careercanvas-ios')) return 'ios';
  if (ua.includes('careercanvas-android')) return 'android';
  return 'web';
};