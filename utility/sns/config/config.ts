import Joi from "joi";
import "dotenv/config";

const envVarsSchema = Joi.object()
  .keys({
    AWSREGION: Joi.string().required(),
    NODE_ENV: Joi.string()
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

const config = {
  aws: {
    region: envVars.AWSREGION,
  },
  env: envVars.NODE_ENV,
};

export default config;
