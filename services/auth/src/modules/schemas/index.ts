import joi from "joi";

export const authSchema = joi
  .object()
  .keys({
    email: joi.string().email().trim(),
    phone: joi
      .string()
      .regex(/^\+[1-9]\d{1,14}$/)
      .trim(),
  })
  .xor("email", "phone")
  .unknown(false);
