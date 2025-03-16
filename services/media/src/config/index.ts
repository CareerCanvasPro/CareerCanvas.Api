import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWS_REGION: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().default(8002),
    S3_BUCKET: joi.string().required(),
    USERS_BASE_URL: joi.string().required(),
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
  baseUrl: {
    users: envVars.USERS_BASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  port: envVars.PORT,
  s3: {
    bucket: envVars.S3_BUCKET,
  },
};
