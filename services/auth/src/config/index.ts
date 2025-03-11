import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWS_REGION: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    MAIL_HOST: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_PORT: joi.string().required(),
    MAIL_USERNAME: joi.string().required(),
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
    region: envVars.AWS_REGION,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  mail: {
    host: envVars.MAIL_HOST,
    password: envVars.MAIL_PASSWORD,
    port: envVars.MAIL_PORT,
    username: envVars.MAIL_USERNAME,
  },
  port: envVars.PORT,
};

export const prismaClient = new PrismaClient();
