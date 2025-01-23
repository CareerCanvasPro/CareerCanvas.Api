import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),

    AWSREGION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
  })
  // Ensure at least one key from each pair is provided
  .or('AWSREGION', 'AWSREGION_STAGING', 'AWSREGION_PRODUCTION')
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Dynamically select the appropriate values based on NODE_ENV
const config = {
  env: envVars.NODE_ENV,
  aws: {
    region: envVars.NODE_ENV === 'production' ? envVars.AWSREGION_PRODUCTION : envVars.AWSREGION
  },
};

export default config;