import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { OTPRepository } from '../repositories/otp.repository';
import { MagicLinkRepository } from '../repositories/magic-link.repository';
import { NotificationService, AWSNotificationService } from './notification.service';
import { User, OTP, MagicLink } from '../types';
import { AuthenticationError, NotFoundError } from '../lib/errors';
import { MessagingService } from './messaging.service';
import { detectPlatform } from '../lib/platform';

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly otpRepository: OTPRepository;
  private readonly magicLinkRepository: MagicLinkRepository;
  private readonly notificationService: NotificationService;
  private readonly jwtSecret: string;
  private readonly tokenExpiry: number;
  private readonly messagingService: MessagingService;

  constructor() {
    this.userRepository = new UserRepository();
    this.otpRepository = new OTPRepository();
    this.magicLinkRepository = new MagicLinkRepository();
    this.notificationService = new AWSNotificationService();
    this.jwtSecret = process.env.AUTH_JWT_SECRET!;
    this.tokenExpiry = parseInt(process.env.AUTH_TOKEN_EXPIRY!) || 86400;
    this.messagingService = new MessagingService();
  }

  async sendMagicLink(email: string, method: 'email' | 'whatsapp', userAgent?: string): Promise<void> {
    const token = uuidv4();
    const platform = detectPlatform(userAgent);
    
    const magicLink = {
      id: uuidv4(),
      token,
      email,
      expires: Math.floor(Date.now() / 1000) + 3600,
      used: false
    };

    await this.magicLinkRepository.create(magicLink);
    const { subject, content } = this.messagingService.generateMagicLinkContent(token, platform);

    if (method === 'email') {
      await this.notificationService.sendEmail(email, subject, content);
    } else {
      await this.notificationService.sendWhatsApp(email, content);
    }
  }

  async sendOTP(phoneNumber: string, userAgent?: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const platform = detectPlatform(userAgent);
    
    const otp = {
      id: uuidv4(),
      code,
      phoneNumber,
      expires: Math.floor(Date.now() / 1000) + 300,
      verified: false
    };

    await this.otpRepository.create(otp);
    const content = this.messagingService.generateOTPContent(code, platform);
    await this.notificationService.sendSMS(phoneNumber, content);
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const otp = await this.otpRepository.findByPhoneAndCode(phoneNumber, code);
    if (!otp || otp.verified || otp.expires < Math.floor(Date.now() / 1000)) {
      throw new AuthenticationError('Invalid or expired OTP');
    }

    await this.otpRepository.markAsVerified(otp.id);
    let user = await this.userRepository.findByPhone(phoneNumber);

    if (!user) {
      user = await this.userRepository.create({
        id: uuidv4(),
        phone: phoneNumber,
        email: '',
        password: '',
        name: ''
      });
    }

    const token = this.generateToken(user.id);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async register(data: Omit<User, "id">): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AuthenticationError("Email already registered");
    }

    const hashedPassword = await hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      id: uuidv4(),
      password: hashedPassword
    });

    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id);

    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError();
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError();
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id);

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User not found with id: ${userId}`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string): string {
    return sign({ userId }, this.jwtSecret, {
      expiresIn: this.tokenExpiry
    });
  }

  async sendMagicLink(email: string, method: 'email' | 'whatsapp'): Promise<void> {
    const token = uuidv4();
    const magicLink = {
      id: uuidv4(),
      token,
      email,
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      used: false
    };

    // TODO: Save magic link to DynamoDB
    if (method === 'email') {
      // TODO: Send email with magic link
    } else {
      // TODO: Send WhatsApp message with magic link
    }
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const otp = {
      id: uuidv4(),
      code,
      phoneNumber,
      expires: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      verified: false
    };

    // TODO: Save OTP to DynamoDB
    // TODO: Send SMS with OTP
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // TODO: Verify OTP from DynamoDB
    // TODO: Create or get user
    // TODO: Generate JWT token
    throw new Error('Not implemented');
  }

  async verifyMagicLink(token: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const magicLink = await this.magicLinkRepository.findByToken(token);
    
    if (!magicLink || magicLink.used || magicLink.expires < Math.floor(Date.now() / 1000)) {
      throw new AuthenticationError('Invalid or expired magic link');
    }

    await this.magicLinkRepository.markAsUsed(magicLink.id);
    let user = await this.userRepository.findByEmail(magicLink.email);

    if (!user) {
      user = await this.userRepository.create({
        id: uuidv4(),
        email: magicLink.email,
        password: '',
        name: magicLink.email.split('@')[0], // Temporary name from email
        phone: ''
      });
    }

    const token = this.generateToken(user.id);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Remove duplicate sendMagicLink and sendOTP methods
  async sendMagicLink(email: string, method: 'email' | 'whatsapp'): Promise<void> {
    const token = uuidv4();
    const magicLink = {
      id: uuidv4(),
      token,
      email,
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      used: false
    };

    // TODO: Save magic link to DynamoDB
    if (method === 'email') {
      // TODO: Send email with magic link
    } else {
      // TODO: Send WhatsApp message with magic link
    }
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const otp = {
      id: uuidv4(),
      code,
      phoneNumber,
      expires: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      verified: false
    };

    // TODO: Save OTP to DynamoDB
    // TODO: Send SMS with OTP
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // TODO: Verify OTP from DynamoDB
    // TODO: Create or get user
    // TODO: Generate JWT token
    throw new Error('Not implemented');
  }
}