import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    AWS_REGION: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    PORT: Joi.number().default(8002),
    S3_BUCKET: Joi.string().required(),
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
  s3: {
    bucket: envVars.S3_BUCKET,
  },
};
