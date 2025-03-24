import joi from "joi";

export const userValidator = joi
  .object()
  .keys({
    address: joi.string().required().trim(),
    email: joi.string().email().trim(),
    name: joi.string().required().trim(),
    phone: joi.string().regex(/^\+[1-9]\d{1,14}$/),
    profilePicture: joi
      .string()
      .uri({
        scheme: ["https"],
      })
      .required(),
    userId: joi.string().required(),
    username: joi.string().required(),
  })
  .or("email", "phone")
  .unknown(false)
  .required();
