import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    ACCESS_KEY: Joi.string().optional(),
    ACCESS_KEY_PRODUCTION: Joi.string().optional(),
    ACCESS_KEY_STAGING: Joi.string().optional(),

    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),

    NODE_ENV: Joi.string()
      .valid("production", "development", "staging")
      .required(),

    SECRET_ACCESS_KEY: Joi.string().optional(),
    SECRET_ACCESS_KEY_PRODUCTION: Joi.string().optional(),
    SECRET_ACCESS_KEY_STAGING: Joi.string().optional(),
  })
  .or("ACCESS_KEY", "ACCESS_KEY_PRODUCTION", "ACCESS_KEY_STAGING")
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .or(
    "SECRET_ACCESS_KEY",
    "SECRET_ACCESS_KEY_PRODUCTION",
    "SECRET_ACCESS_KEY_STAGING"
  )
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  aws: {
    accessKey:
      envVars.NODE_ENV === "production"
        ? envVars.ACCESS_KEY_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.ACCESS_KEY_STAGING
        : envVars.ACCESS_KEY,
    region:
      envVars.NODE_ENV === "production"
        ? envVars.AWSREGION_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.AWSREGION_STAGING
        : envVars.AWSREGION,
    secretAccessKey:
      envVars.NODE_ENV === "production"
        ? envVars.SECRET_ACCESS_KEY_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.SECRET_ACCESS_KEY_STAGING
        : envVars.SECRET_ACCESS_KEY,
  },
  env: envVars.NODE_ENV,
};
