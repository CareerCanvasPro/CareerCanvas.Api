import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),

    CLIENTID: Joi.string().optional(),
    CLIENTID_PRODUCTION: Joi.string().optional(),
    CLIENTID_STAGING: Joi.string().optional(),

    CLIENTSECRET: Joi.string().optional(),
    CLIENTSECRET_PRODUCTION: Joi.string().optional(),
    CLIENTSECRET_STAGING: Joi.string().optional(),

    NODE_ENV: Joi.string()
      .valid("development", "production", "staging")
      .required(),

    PORT: Joi.number().default(5000),

    USERPOOLID: Joi.string().optional(),
    USERPOOLID_PRODUCTION: Joi.string().optional(),
    USERPOOLID_STAGING: Joi.string().optional(),
  })
  // Enforce at least one key from each pair (AWSREGION, CLIENTID, etc.)
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .or("CLIENTID", "CLIENTID_PRODUCTION", "CLIENTID_STAGING")
  .or("CLIENTSECRET", "CLIENTSECRET_PRODUCTION", "CLIENTSECRET_STAGING")
  .or("USERPOOLID", "USERPOOLID_PRODUCTION", "USERPOOLID_STAGING")
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
