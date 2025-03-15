import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config';
import { OtpsDb, UsersDb } from '../modules/services';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { otp, username } = event.queryStringParameters || {};
    
    if (!otp || !username) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: 'OTP and username are required' }),
      };
    }

    const otpsDb = new OtpsDb();
    const usersDb = new UsersDb();

    const { foundOtp } = await otpsDb.findOtp({
      otp: otp as string,
      username: username as string,
    });

    if (foundOtp) {
      if (foundOtp.expiresAt >= new Date()) {
        const { user } = await usersDb.findUser({
          username: username as string,
        });

        const isNewUser = !user;

        const userId = isNewUser ? uuidv4() : user.id;

        return new Promise((resolve) => {
          sign(
            {
              userId,
              username,
            },
            config.jwt.secret,
            {
              expiresIn: '7d',
            },
            (error, accessToken) => {
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
                if (isNewUser) {
                  const coins = 5;

                  resolve({
                    statusCode: 200,
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                      data: {
                        accessToken,
                        coins,
                        expiresAt: Date.now() + 604800000,
                        isNewUser,
                        username,
                      },
                      message: 'OTP verified successfully',
                    }),
                  });
                } else {
                  resolve({
                    statusCode: 200,
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                      data: {
                        accessToken,
                        expiresAt: Date.now() + 604800000,
                        isNewUser,
                        username,
                      },
                      message: 'OTP verified successfully',
                    }),
                  });
                }
              }
            }
          );
        });
      } else {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ data: null, message: 'OTP has expired' }),
        };
      }
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ data: null, message: 'Invalid OTP' }),
      };
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