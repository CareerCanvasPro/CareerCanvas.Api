import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    AWSREGION: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid("production", "development", "staging")
      .required(),
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
    region: envVars.AWSREGION,
  },
  env: envVars.NODE_ENV,
};
