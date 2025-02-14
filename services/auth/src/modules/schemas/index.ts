import joi from "joi";

export const authSchema = joi
  .object()
  .keys({
    email: joi.string().email().required().trim(),
  })
  .unknown();
