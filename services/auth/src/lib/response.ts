import { APIGatewayProxyResult } from 'aws-lambda';
import { AppError, ValidationError, AuthenticationError, NotFoundError, ConflictError, ServerError } from './errors';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
};

export const response = {
  success: (data: any, statusCode: number = 200): APIGatewayProxyResult => ({
    statusCode,
    headers,
    body: JSON.stringify({
      success: true,
      data
    })
  }),

  error: (error: Error, defaultMessage: string = 'Internal server error'): APIGatewayProxyResult => {
    console.error(error);

    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        })
      };
    }

    const serverError = new ServerError(defaultMessage);
    return {
      statusCode: serverError.statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: {
          code: serverError.code,
          message: serverError.message
        }
      })
    };
  }
};