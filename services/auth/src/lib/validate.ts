import { Schema } from 'joi';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { response } from './response';
import { ValidationError } from './errors';

export const validate = (schema: Schema) => {
  return async (data: unknown) => {
    try {
      const value = await schema.validateAsync(data, {
        abortEarly: false,
        stripUnknown: true
      });
      return { value, error: null };
    } catch (error) {
      if (error instanceof JoiValidationError) {
        const message = error.details
          .map(detail => detail.message)
          .join(', ');
        throw new ValidationError(message);
      }
      throw error;
    }
  };
};

export const validatePathParameters = (schema: Schema) => {
  return async (event: APIGatewayProxyEvent) => {
    try {
      await schema.validateAsync(event.pathParameters, { abortEarly: false });
      return null;
    } catch (error) {
      return response.error(error, 'Invalid path parameters');
    }
  };
};