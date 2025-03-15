import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config';
import { UsersDb } from '../modules/services';

interface ITokenPayload {
  username: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { token } = event.queryStringParameters || {};
    
    if (!token) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html',
        },
        body: renderErrorPage('400 Bad Request', '400 Bad Request | Missing token'),
      };
    }

    const usersDb = new UsersDb();

    return new Promise((resolve) => {
      verify(
        token,
        config.jwt.secret,
        async (error: unknown, decoded: ITokenPayload) => {
          if (error) {
            if ((error as Error).name === 'JsonWebTokenError') {
              resolve({
                statusCode: 401,
                headers: {
                  'Content-Type': 'text/html',
                },
                body: renderErrorPage('401 Unauthorized', '401 Unauthorized | Invalid link'),
              });
            } else if ((error as Error).name === 'TokenExpiredError') {
              resolve({
                statusCode: 401,
                headers: {
                  'Content-Type': 'text/html',
                },
                body: renderErrorPage('401 Unauthorized', '401 Unauthorized | Link has expired'),
              });
            }
          } else {
            const { username } = decoded;

            const { user } = await usersDb.findUser({ username });

            const isNewUser = !user;

            const userId = isNewUser ? uuidv4() : user.id;

            verify(
              token,
              config.jwt.secret,
              (error, decoded) => {
                if (error) {
                  resolve({
                    statusCode: 500,
                    headers: {
                      'Content-Type': 'text/html',
                    },
                    body: renderErrorPage('500 Internal Server Error', '500 Internal Server Error'),
                  });
                } else {
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
                            'Content-Type': 'text/html',
                          },
                          body: renderErrorPage('500 Internal Server Error', '500 Internal Server Error'),
                        });
                      } else {
                        if (isNewUser) {
                          const coins = 5;

                          resolve({
                            statusCode: 301,
                            headers: {
                              'Location': `https://careercanvas.pro/auth/callback?token=${accessToken}&isNewUser=${isNewUser}&username=${username}&expiresAt=${Date.now() + 604800000}&coins=${coins}`,
                            },
                            body: '',
                          });
                        } else {
                          resolve({
                            statusCode: 301,
                            headers: {
                              'Location': `https://careercanvas.pro/auth/callback?token=${accessToken}&isNewUser=${isNewUser}&username=${username}&expiresAt=${Date.now() + 604800000}`,
                            },
                            body: '',
                          });
                        }
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: renderErrorPage('500 Internal Server Error', '500 Internal Server Error'),
    };
  }
};

function renderErrorPage(title: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 50px;
            margin: 0;
          }
          .container {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            color: #d9534f;
          }
          p {
            font-size: 18px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${title}</h1>
          <p>${message}</p>
        </div>
      </body>
    </html>
  `;
}