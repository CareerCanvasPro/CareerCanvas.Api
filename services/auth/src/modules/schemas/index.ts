import joi from "joi";

export const emailSchema = joi
  .object()
  .keys({
    email: joi.string().email().required().trim(),
  })
  .unknown(false);

export const phoneSchema = joi
  .object()
  .keys({
    phone: joi
      .string()
      .regex(/^\+[1-9]\d{1,14}$/)
      .required()
      .trim(),
  })
  .unknown(false);
