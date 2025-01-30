import "dotenv/config";
import { number, object, string } from "joi";

const envVarsSchema = object()
  .keys({
    AWSREGION: string().optional(),
    AWSREGION_PRODUCTION: string().optional(),
    AWSREGION_STAGING: string().optional(),

    CLIENTSECRET: string().optional(),
    CLIENTSECRET_PRODUCTION: string().optional(),
    CLIENTSECRET_STAGING: string().optional(),

    NODE_ENV: string().valid("development", "production", "staging").required(),

    PORT: number().default(5000),
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
