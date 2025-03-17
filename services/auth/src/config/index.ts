import { PrismaClient } from "@prisma/client";
import joi from "joi";
import { getParameter } from "./ssm";

const isDevelopment = process.env.NODE_ENV !== 'production';

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi.string().valid('development', 'production').default('development'),
    AUTH_BASE_URL: joi.string().required(),
    AWS_REGION: joi.string().when('NODE_ENV', {
      is: 'production',
      then: joi.string().required(),
      otherwise: joi.string().optional(),
    }),
    PORT: joi.number().default(8001),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  aws: {
    region: envVars.AWS_REGION || 'ap-southeast-1',
  },
  baseUrl: {
    auth: envVars.AUTH_BASE_URL,
  },
  jwt: {
    secret: isDevelopment ? 'dev_jwt_secret_key' : await getParameter('JWT_SECRET'),
  },
  mail: {
    host: isDevelopment ? 'smtp.mailtrap.io' : await getParameter('MAIL_HOST'),
    password: isDevelopment ? 'dev_password' : await getParameter('MAIL_PASSWORD'),
    port: isDevelopment ? '2525' : await getParameter('MAIL_PORT'),
    username: isDevelopment ? 'dev_user' : await getParameter('MAIL_USERNAME'),
  },
  port: envVars.PORT,
};

export const prismaClient = new PrismaClient();
