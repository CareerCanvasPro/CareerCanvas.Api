import joi from "joi";

export const adminValidator = joi
  .object()
  .keys({
    email: joi.string().required().trim(),
    password: joi.string().required(),
  })
  .unknown(false)
  .required();
