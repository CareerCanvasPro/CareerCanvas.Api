export interface NotificationService {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
  sendWhatsApp(to: string, message: string): Promise<void>;
}

export class AWSNotificationService implements NotificationService {
  private readonly ses: AWS.SES;
  private readonly twilioClient: twilio.Twilio;
  private readonly countryPrefixes = {
    BD: '+880',
    SA: '+966',
    AE: '+971',
    KW: '+965'
  };

  async sendSMS(to: string, message: string): Promise<void> {
    // Use Twilio for supported countries
    if (this.isTargetRegion(to)) {
      await this.twilioClient.messages.create({
        body: message,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        // Enable delivery tracking for important messages
        statusCallback: process.env.SMS_WEBHOOK_URL
      });
    } else {
      // Fallback to SNS for other regions
      await this.sns.publish({
        Message: message,
        PhoneNumber: to
      }).promise();
    }
  }

  private isTargetRegion(phoneNumber: string): boolean {
    return Object.values(this.countryPrefixes)
      .some(prefix => phoneNumber.startsWith(prefix));
  }
}