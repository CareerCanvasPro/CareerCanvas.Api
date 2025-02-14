export interface DeepLinkOptions {
  path: string;
  params?: Record<string, string>;
}

export const generateDeepLink = (platform: 'web' | 'ios' | 'android', options: DeepLinkOptions): string => {
  const { path, params } = options;
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';

  switch (platform) {
    case 'web':
      return `${process.env.WEB_URL}${path}${queryString}`;
    
    case 'ios':
      return `${process.env.MOBILE_APP_SCHEME}://${process.env.DEEP_LINK_DOMAIN}${path}${queryString}`;
    
    case 'android':
      return `${process.env.MOBILE_APP_SCHEME}://${process.env.DEEP_LINK_DOMAIN}${path}${queryString}`;
    
    default:
      throw new Error('Invalid platform');
  }
};

export const generateUniversalLink = (options: DeepLinkOptions): string => {
  const { path, params } = options;
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `https://${process.env.DEEP_LINK_DOMAIN}${path}${queryString}`;
};