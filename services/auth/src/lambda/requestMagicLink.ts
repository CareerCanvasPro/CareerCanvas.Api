import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { renderFile } from 'ejs';
import { join } from 'path';
import { sign } from 'jsonwebtoken';

import { config } from '../config';
import { getParameter } from '../config/ssm';
import { cleanMessage } from '../utils';
import { emailSchema } from '../modules/schemas';
import { Nodemailer } from '../modules/services';
import prisma from '../modules/services/prisma';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Validate essential services
    await Promise.all([
      getParameter('JWT_SECRET'),
      prisma.$connect()
    ]);

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

      return new Promise((resolve) => {
        sign(
          { username: email },
          config.jwt.secret,
          {
            expiresIn: '15m',
          },
          async (error, token) => {
            if (error) {
              resolve({
                statusCode: 500,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ data: null, message: `${error.name}: ${error.message}` }),
              });
            } else {
              const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8001';
              const magicLink = `${apiGatewayUrl}/auth/magic-link/verify?token=${token}`;

              await nodemailer.sendMail({
                html: await renderFile(
                  join(
                    __dirname,
                    '..',
                    '..',
                    'src',
                    'views',
                    'email.ejs'
                  ),
                  { magicLink }
                ),
                subject: 'Magic Link to Career Canvas',
                text: `Copy and paste the link below into your browser to access your account:\n\t${magicLink}`,
                to: email,
              });

              resolve({
                statusCode: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                  data: null,
                  message: 'Magic link sent to given email successfully',
                }),
              });
            }
          }
        );
      });
    }
  } catch (error) {
    console.error('Error in requestMagicLink:', error instanceof Error ? error.stack : error);

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    // Handle database connection errors
    if (error.name === 'PrismaClientInitializationError' || error.name === 'PrismaClientKnownRequestError') {
      console.error('Database connection error:', error.message);
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          data: null,
          message: 'Service temporarily unavailable. Please try again later.'
        })
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
        body: JSON.stringify({ 
          data: null, 
          message: 'Server configuration error. Please contact support if this persists.' 
        }),
      };
    }

    if (error.$metadata && error.$metadata.httpStatusCode) {
      console.error('AWS Service error:', error.message);
      return {
        statusCode: error.$metadata.httpStatusCode,
        headers,
        body: JSON.stringify({ 
          data: null, 
          message: `Service error: ${error.message}. Please try again later.` 
        }),
      };
    }

    console.error('Unhandled error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        data: null, 
        message: 'An unexpected error occurred. Please try again later.' 
      }),
    };

  }
};