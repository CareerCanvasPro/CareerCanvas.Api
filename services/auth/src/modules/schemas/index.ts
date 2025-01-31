import joi from "joi";

export const authSchema = joi
  .object()
  .keys({
    email: joi.string().email().required().trim(),
  })
  .unknown();

export const confirmAuthSchema = joi
  .object()
  .keys({
    token: joi.string().required(),
  })
  .unknown();
