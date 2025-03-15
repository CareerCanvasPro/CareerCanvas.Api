import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.REGION });
async function getParameter(name: string) {
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const response = await ssm.send(command);
  return response.Parameter?.Value;
}
import { renderFile } from 'ejs';
import { join } from 'path';
import { sign } from 'jsonwebtoken';

import { config } from '../config';
import { cleanMessage } from '../utils';
import { emailSchema } from '../modules/schemas';
import { Nodemailer } from '../modules/services';

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
              const magicLink = `http://54.151.208.63:8001/auth/magic-link/verify?token=${token}`;

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
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: `${error.name}: ${error.message}` }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: `${error.name}: ${error.message}` }),
      };
    }
  }
};