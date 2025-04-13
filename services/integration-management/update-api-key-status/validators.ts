import joi from "joi";

export const apiKeyStatusValidator = joi
  .string()
  .valid("ACTIVE", "INACTIVE")
  .required();
