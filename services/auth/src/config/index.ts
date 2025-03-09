import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWS_REGION: joi.string().optional(),
    AWS_REGION_PRODUCTION: joi.string().optional(),
    ENV: joi.string().valid("development", "production").required(),
    JWT_SECRET: joi.string().optional(),
    JWT_SECRET_PRODUCTION: joi.string().optional(),
    MAIL_HOST: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_PORT: joi.string().required(),
    MAIL_USERNAME: joi.string().required(),
    PORT: joi.number().default(8001),
  })
  .or("AWS_REGION", "AWS_REGION_PRODUCTION")
  .or("JWT_SECRET", "JWT_SECRET_PRODUCTION")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  aws: {
    region:
      envVars.ENV === "production"
        ? envVars.AWS_REGION_PRODUCTION
        : envVars.AWS_REGION,
  },
  jwt: {
    secret:
      envVars.ENV === "production"
        ? envVars.JWT_SECRET_PRODUCTION
        : envVars.JWT_SECRET,
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
