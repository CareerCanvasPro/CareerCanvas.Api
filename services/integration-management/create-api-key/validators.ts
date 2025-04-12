import joi from "joi";

export const apiKeyPropsValidator = joi
  .object()
  .keys({
    expiresInDays: joi.number().min(1).required(),
    scopes: joi
      .array()
      .items(joi.string().valid("READ_DATA", "WRITE_DATA").required())
      .required(),
  })
  .unknown(false)
  .required();
