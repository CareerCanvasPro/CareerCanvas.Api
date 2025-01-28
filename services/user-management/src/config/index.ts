import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),

    CLIENTSECRET: Joi.string().optional(),
    CLIENTSECRET_PRODUCTION: Joi.string().optional(),
    CLIENTSECRET_STAGING: Joi.string().optional(),

    NODE_ENV: Joi.string()
      .valid("development", "production", "staging")
      .required(),

    PORT: Joi.number().default(8000),
  })
  // Ensure at least one of AWSREGION or AWSREGION_PRODUCTION is provided
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .or("CLIENTSECRET", "CLIENTSECRET_PRODUCTION", "CLIENTSECRET_STAGING")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Dynamically select the appropriate region based on NODE_ENV
export const config = {
  aws: {
    clientSecret:
      envVars.NODE_ENV === "production"
        ? envVars.CLIENTSECRET_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.CLIENTSECRET_STAGING
        : envVars.CLIENTSECRET,
    region:
      envVars.NODE_ENV === "production"
        ? envVars.AWSREGION_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.AWSREGION_STAGING
        : envVars.AWSREGION,
  },
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};
