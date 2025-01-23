import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    ACCESSKEY: Joi.string().optional(),
    ACCESSKEY_PRODUCTION: Joi.string().optional(),
    ACCESSKEY_STAGING: Joi.string().optional(),

    AUTH_SERVICE: Joi.string().optional(),
    AUTH_SERVICE_PRODUCTION: Joi.string().optional(),
    AUTH_SERVICE_STAGING: Joi.string().optional(),

    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),
    AWSREGION_STAGING: Joi.string().optional(),

    BUCKETNAME: Joi.string().optional(),
    BUCKETNAME_PRODUCTION: Joi.string().optional(),
    BUCKETNAME_STAGING: Joi.string().optional(),

    CLIENTID: Joi.string().optional(),
    CLIENTID_PRODUCTION: Joi.string().optional(),
    CLIENTID_STAGING: Joi.string().optional(),

    CLIENTSECRET: Joi.string().optional(),
    CLIENTSECRET_PRODUCTION: Joi.string().optional(),
    CLIENTSECRET_STAGING: Joi.string().optional(),

    MEDIA_SERVICE: Joi.string().optional(),
    MEDIA_SERVICE_PRODUCTION: Joi.string().optional(),
    MEDIA_SERVICE_STAGING: Joi.string().optional(),

    NODE_ENV: Joi.string()
      .valid("development", "production", "staging")
      .required(),

    PORT: Joi.number().default(5000),

    SEARCH_SERVICE: Joi.string().optional(),
    SEARCH_SERVICE_PRODUCTION: Joi.string().optional(),
    SEARCH_SERVICE_STAGING: Joi.string().optional(),

    SECRETHASH: Joi.string().optional(),
    SECRETHASH_PRODUCTION: Joi.string().optional(),
    SECRETHASH_STAGING: Joi.string().optional(),

    SECRETKEY: Joi.string().optional(),
    SECRETKEY_PRODUCTION: Joi.string().optional(),
    SECRETKEY_STAGING: Joi.string().optional(),

    USER_MANAGEMENT_SERVICE: Joi.string().optional(),
    USER_MANAGEMENT_SERVICE_PRODUCTION: Joi.string().optional(),
    USER_MANAGEMENT_SERVICE_STAGING: Joi.string().optional(),

    USERPOOLID: Joi.string().optional(),
    USERPOOLID_PRODUCTION: Joi.string().optional(),
    USERPOOLID_STAGING: Joi.string().optional(),
  })
  // Enforce at least one key from each pair (AWSREGION, CLIENTID, etc.)
  .or("ACCESSKEY", "ACCESSKEY_PRODUCTION", "ACCESSKEY_STAGING")
  .or("AUTH_SERVICE", "AUTH_SERVICE_PRODUCTION", "AUTH_SERVICE_STAGING")
  .or("AWSREGION", "AWSREGION_PRODUCTION", "AWSREGION_STAGING")
  .or("BUCKETNAME", "BUCKETNAME_PRODUCTION", "BUCKETNAME_STAGING")
  .or("CLIENTID", "CLIENTID_PRODUCTION", "CLIENTID_STAGING")
  .or("CLIENTSECRET", "CLIENTSECRET_PRODUCTION", "CLIENTSECRET_STAGING")
  .or("MEDIA_SERVICE", "MEDIA_SERVICE_PRODUCTION", "MEDIA_SERVICE_STAGING")
  .or("SEARCH_SERVICE", "SEARCH_SERVICE_PRODUCTION", "SEARCH_SERVICE_STAGING")
  .or("SECRETHASH", "SECRETHASH_PRODUCTION", "SECRETHASH_STAGING")
  .or("SECRETKEY", "SECRETKEY_PRODUCTION", "SECRETKEY_STAGING")
  .or(
    "USER_MANAGEMENT_SERVICE",
    "USER_MANAGEMENT_SERVICE_PRODUCTION",
    "USER_MANAGEMENT_SERVICE_STAGING"
  )
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
      secretHash:
        envVars.NODE_ENV === "production"
          ? envVars.SECRETHASH_PRODUCTION
          : envVars.NODE_ENV === "staging"
          ? envVars.SECRETHASH_STAGING
          : envVars.SECRETHASH,
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
  s3: {
    accessKey:
      envVars.NODE_ENV === "production"
        ? envVars.ACCESSKEY_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.ACCESSKEY_STAGING
        : envVars.ACCESSKEY,
    bucketName:
      envVars.NODE_ENV === "production"
        ? envVars.BUCKETNAME_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.BUCKETNAME_STAGING
        : envVars.BUCKETNAME,
    secretKey:
      envVars.NODE_ENV === "production"
        ? envVars.SECRETKEY_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.SECRETKEY_STAGING
        : envVars.SECRETKEY,
  },
  service: {
    authservice:
      envVars.NODE_ENV === "production"
        ? envVars.AUTH_SERVICE_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.AUTH_SERVICE_STAGING
        : envVars.AUTH_SERVICE,
    userManagement:
      envVars.NODE_ENV === "production"
        ? envVars.USER_MANAGEMENT_SERVICE_PRODUCTION
        : envVars.NODE_ENV === "staging"
        ? envVars.USER_MANAGEMENT_SERVICE_STAGING
        : envVars.USER_MANAGEMENT_SERVICE,
  },
};
