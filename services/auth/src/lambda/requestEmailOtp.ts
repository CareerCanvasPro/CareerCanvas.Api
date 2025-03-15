import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { renderFile } from 'ejs';
import { join } from 'path';
import otpGenerator from 'otp-generator';

import { config } from '../config';
import { cleanMessage } from '../utils';
import { emailSchema } from '../modules/schemas';
import { Nodemailer, OtpsDb } from '../modules/services';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    const { error, value } = emailSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((error) =>
        cleanMessage(error.message)
      );

      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: validationErrors }),
      };
    } else {
      const { email } = value;
      const nodemailer = new Nodemailer();
      const otpsDb = new OtpsDb();

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });

      await nodemailer.sendMail({
        html: await renderFile(
          join(__dirname, '..', '..', 'src', 'views', 'email-otp.ejs'),
          { otp }
        ),
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
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          data: null,
          message: 'OTP sent to given email successfully',
        }),
      };
    }
  } catch (error) {
    console.error('Error in requestEmailOtp:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: 'Invalid request parameters' }),
      };
    }
    
    if (error.name === 'Error' && error.message.includes('Config validation error')) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: 'Server configuration error' }),
      };
    }
    
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: `Service error: ${error.message}` }),
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ data: null, message: 'Internal server error' }),
    };
  }
};