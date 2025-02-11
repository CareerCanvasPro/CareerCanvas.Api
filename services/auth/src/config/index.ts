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

    PORT: joi.number().default(80001),
  })
  // Enforce at least one key from each pair (AWSREGION, CLIENTID, etc.)
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .or("CLIENTSECRET", "CLIENTSECRET_PRODUCTION", "CLIENTSECRET_STAGING")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Dynamic selection of values based on NODE_ENV
export const config = {
  aws: {
    cognito: {
      clientId:
        envVars.NODE_ENV === "production"
          ? envVars.CLIENTID_PRODUCTION
          : envVars.NODE_ENV === "staging"
          ? envVars.CLIENTID_STAGING
          : envVars.CLIENTID,
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
      userPoolId:
        envVars.NODE_ENV === "production"
          ? envVars.USERPOOLID_PRODUCTION
          : envVars.NODE_ENV === "staging"
          ? envVars.USERPOOLID_STAGING
          : envVars.USERPOOLID,
    },
  },
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};
