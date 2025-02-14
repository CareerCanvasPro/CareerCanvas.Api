import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWSREGION: joi.string().optional(),
    AWSREGION_PRODUCTION: joi.string().optional(),
    AWSREGION_STAGING: joi.string().optional(),

    CLIENTSECRET: joi.string().optional(),
    CLIENTSECRET_PRODUCTION: joi.string().optional(),
    CLIENTSECRET_STAGING: joi.string().optional(),

    NODE_ENV: joi
      .string()
      .valid("development", "production", "staging")
      .required(),

    PORT: joi.number().default(8005),
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
