import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthService } from '../modules/core/auth';
import { Nodemailer } from '../modules/services/nodemailer';
import { OtpsDb } from '../modules/services/otps';
import otpGenerator from 'otp-generator';
import { renderFile } from 'ejs';
import { join } from 'path';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Ensure email exists
    if (!body.email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ data: null, message: 'Email is required' }),
      };
    }

    const authService = AuthService.getInstance();
    const response = await authService.requestEmailOtp(body);

    if (response) {
      return response;
    }

    const { email } = body;
    const nodemailer = new Nodemailer();
    const otpsDb = new OtpsDb();

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    await nodemailer.sendMail({
      html: await renderFile(join(__dirname, '..', '..', 'src', 'views', 'email-otp.ejs'), { otp }),
      subject: 'OTP for Career Canvas Account Verification',
      text: `Your One-Time Password (OTP) for Career Canvas account verification is ${otp}.`,
      to: email,
    });

    await otpsDb.createOtp({ otp, username: email });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ data: null, message: 'OTP sent to given email successfully' }),
    };
  } catch (error) {
    console.error('Error in requestEmailOtp:', error instanceof Error ? error.stack : error);

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (error.name === 'PrismaClientInitializationError' || error.name === 'PrismaClientKnownRequestError') {
      console.error('Database connection error:', error.message);
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ data: null, message: 'Service temporarily unavailable. Please try again later.' }),
      };
    }

    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ data: null, message: error.message }),
      };
    }

    if (error.name === 'Error' && error.message.includes('Config validation error')) {
      console.error('Configuration error:', error.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ data: null, message: 'Server configuration error. Please contact support if this persists.' }),
      };
    }

    if (error.$metadata && error.$metadata.httpStatusCode) {
      console.error('AWS Service error:', error.message);
      return {
        statusCode: error.$metadata.httpStatusCode,
        headers,
        body: JSON.stringify({ data: null, message: `Service error: ${error.message}. Please try again later.` }),
      };
    }

    console.error('Unhandled error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ data: null, message: 'An unexpected error occurred. Please try again later.' }),
    };
  }
};
