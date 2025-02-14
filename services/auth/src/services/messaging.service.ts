import { Platform } from '../lib/platform';
import { generateDeepLink, generateUniversalLink } from '../lib/deep-link';
import { getMagicLinkEmailTemplate, getWelcomeEmailTemplate } from '../templates/email';

export class MessagingService {
  generateMagicLinkContent(token: string, platform: Platform, name?: string): { subject: string; html: string; text: string } {
    const deepLink = generateDeepLink(platform, {
      path: '/auth/verify',
      params: { token }
    });

    const universalLink = generateUniversalLink({
      path: '/auth/verify',
      params: { token }
    });

    const link = platform === 'web' ? deepLink : universalLink;
    
    return {
      subject: 'Login to CareerCanvas',
      html: getMagicLinkEmailTemplate(name || '', link),
      text: this.getMagicLinkTextTemplate(platform, deepLink, universalLink)
    };
  }

  generateWelcomeContent(name: string): { subject: string; html: string; text: string } {
    return {
      subject: 'Welcome to CareerCanvas!',
      html: getWelcomeEmailTemplate(name),
      text: this.getWelcomeTextTemplate(name)
    };
  }

  generateOTPContent(code: string, platform: Platform): string {
    return `Your CareerCanvas verification code is: ${code}

This code will expire in 5 minutes.

${platform !== 'web' ? 'Open the CareerCanvas app to enter the code.' : ''}

For security reasons, do not share this code with anyone.`;
  }

  private getMagicLinkTextTemplate(platform: Platform, deepLink: string, universalLink: string): string {
    const baseText = 'Login to CareerCanvas\n\n';
    
    switch (platform) {
      case 'web':
        return `${baseText}Click here to login: ${deepLink}`;
      
      case 'ios':
      case 'android':
        return `${baseText}Click here to login: ${universalLink}\n\nIf the above link doesn't work, copy and paste this URL in your browser:\n${deepLink}`;
      
      default:
        return `${baseText}Click here to login: ${universalLink}`;
    }
  }

  private getWelcomeTextTemplate(name: string): string {
    return `Welcome to CareerCanvas!

Hello${name ? ` ${name}` : ''},

Thank you for joining CareerCanvas. We're excited to help you build and manage your professional profile.

Get started by:
- Completing your profile
- Adding your work experience
- Connecting with other professionals

Need help? Contact our support team.`;
  }
}