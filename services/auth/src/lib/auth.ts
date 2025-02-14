import { APIGatewayProxyEvent } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import { AuthenticationError } from './errors';

interface JwtPayload {
  userId: string;
}

export const verifyToken = (event: APIGatewayProxyEvent): string => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verify(token, process.env.AUTH_JWT_SECRET!) as JwtPayload;
    return decoded.userId;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

export const withAuth = (handler: Function) => async (event: APIGatewayProxyEvent) => {
  try {
    const userId = verifyToken(event);
    event.requestContext.authorizer = { userId };
    return await handler(event);
  } catch (error) {
    throw new AuthenticationError('Unauthorized');
  }
};