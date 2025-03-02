import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    ENV: Joi.string().valid("development", "production").required(),
    BUCKET: Joi.string().optional(),
    BUCKET_PRODUCTION: Joi.string().optional(),
    PORT: Joi.number().default(8002),
    REGION: Joi.string().optional(),
    REGION_PRODUCTION: Joi.string().optional(),
    SECRET: Joi.string().optional(),
    SECRET_PRODUCTION: Joi.string().optional(),
  })
  .or("BUCKET", "BUCKET_PRODUCTION")
  .or("REGION", "REGION_PRODUCTION")
  .or("SECRET", "SECRET_PRODUCTION")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  bucket:
    envVars.ENV === "production" ? envVars.BUCKET_PRODUCTION : envVars.BUCKET,
  port: envVars.PORT,
  region:
    envVars.ENV === "production" ? envVars.REGION_PRODUCTION : envVars.REGION,
  secret:
    envVars.ENV === "production" ? envVars.SECRET_PRODUCTION : envVars.SECRET,
};
