import "dotenv/config";
import joi from "joi";

const envVarsSchema = joi
  .object()
  .keys({
    MAIL_HOST: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_PORT: joi.string().required(),
    MAIL_USERNAME: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  mail: {
    host: envVars.MAIL_HOST,
    password: envVars.MAIL_PASSWORD,
    port: envVars.MAIL_PORT,
    username: envVars.MAIL_USERNAME,
  },
};
