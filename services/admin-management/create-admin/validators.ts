import joi from "joi";

export const adminValidator = joi
  .object()
  .keys({
    name: joi.string().required().trim(),
    password: joi.string().required(),
    token: joi.string().required(),
  })
  .unknown(false)
  .required();
