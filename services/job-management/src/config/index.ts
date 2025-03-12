import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWS_REGION: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().default(8006),
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
  port: envVars.PORT,
};

export const prismaClient = new PrismaClient();
