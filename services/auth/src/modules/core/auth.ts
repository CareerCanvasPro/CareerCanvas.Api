import { APIGatewayProxyResult } from 'aws-lambda';
import { renderFile } from 'ejs';
import { join } from 'path';
import otpGenerator from 'otp-generator';

import { config } from '../../config';
import { getParameter } from '../../config/ssm';
import { cleanMessage } from '../../utils';
import { emailSchema } from '../schemas';
import { Nodemailer, OtpsDb } from '../services';
import prisma from '../services/prisma';

export class AuthService {
  private static instance: AuthService;
  private otpsDb: OtpsDb;
  private mailer: Nodemailer;

  private constructor() {
    this.otpsDb = new OtpsDb();
    this.mailer = new Nodemailer();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async validateRequiredParams(): Promise<void> {
    const requiredParams = ['JWT_SECRET', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME', 'MAIL_PASSWORD'];
    try {
      await Promise.all([
        ...requiredParams.map(param => getParameter(param)),
        prisma.$connect()
      ]);
      console.log('All required parameters validated successfully');
    } catch (paramError) {
      console.error('Failed to retrieve required parameters:', paramError);
      throw paramError;
    }
  }

  private validateEmail(body: any): { error?: string[]; value?: any } {
    const { error, value } = emailSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((error) =>
        cleanMessage(error.message)
      );
      return { error: validationErrors };
    }

    return { value };
  }

  public async requestEmailOtp(body: any): Promise<APIGatewayProxyResult> {
    try {
      await this.validateRequiredParams();

      const validation = this.validateEmail(body);
      if (validation.error) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ data: null, message: validation.error }),
        };
      }

      const { email } = validation.value;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      await this.otpsDb.createOtp({
        otp,
        username: email,
      });

      const emailTemplate = await renderFile(
        join(__dirname, '../../views/email-otp.ejs'),
        {
          otp,
        }
      );

      await this.mailer.sendMail({
        to: email,
        subject: 'CareerCanvas - Email Verification Code',
        html: emailTemplate,
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          data: null,
          message: 'OTP sent successfully',
        }),
      };
    } catch (error) {
      console.error('Error in requestEmailOtp:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          data: null,
          message: 'Internal server error',
        }),
      };
    }
  }
}