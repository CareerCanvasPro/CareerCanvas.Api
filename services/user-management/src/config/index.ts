import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    JWT_SECRET: joi.string().required(),
    MEDIA_BASE_URL: joi.string().required(),
    PORT: joi.number().default(8004),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  baseUrl: {
    media: envVars.MEDIA_BASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  port: envVars.PORT,
};

export const prismaClient = new PrismaClient();
