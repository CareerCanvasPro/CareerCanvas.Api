import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    ENV: joi.string().valid("development", "production").required(),
    PORT: joi.number().default(8003),
    SECRET: joi.string().optional(),
    SECRET_PRODUCTION: joi.string().optional(),
  })
  .or("SECRET", "SECRET_PRODUCTION")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  port: envVars.PORT,
  secret:
    envVars.ENV === "production" ? envVars.SECRET_PRODUCTION : envVars.SECRET,
};

export const prismaClient = new PrismaClient();
