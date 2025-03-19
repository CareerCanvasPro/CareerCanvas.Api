import joi from "joi";

export const emailValidator = joi
  .object()
  .keys({
    email: joi.string().email().required().trim(),
  })
  .unknown(false);
