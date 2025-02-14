import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),

    NODE_ENV: Joi.string()
      .valid("production", "development", "staging")
      .required(),
  })
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
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
      envVars.NODE_ENV === "production"
        ? envVars.AWSREGION_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.AWSREGION_STAGING
        : envVars.AWSREGION,
  },
  env: envVars.NODE_ENV,
};
