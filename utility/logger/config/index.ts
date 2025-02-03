import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWSREGION: joi.string().optional(),
    AWSREGION_PRODUCTION: joi.string().optional(),
    AWSREGION_STAGING: joi.string().optional(),

    NODE_ENV: joi
      .string()
      .valid("development", "production", "staging")
      .required(),
  })
  // Ensure at least one key from each pair is provided
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Dynamically select the appropriate values based on NODE_ENV
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
