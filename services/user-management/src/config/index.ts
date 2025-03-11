import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    ENV: joi.string().valid("development", "production").required(),
    JWT_SECRET: joi.string().optional(),
    JWT_SECRET_PRODUCTION: joi.string().optional(),
    PORT: joi.number().default(8004),
  })
  .or("JWT_SECRET", "JWT_SECRET_PRODUCTION")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  jwt: {
    secret:
      envVars.ENV === "production"
        ? envVars.JWT_SECRET_PRODUCTION
        : envVars.JWT_SECRET,
  },
  port: envVars.PORT,
};

export const prismaClient = new PrismaClient();
