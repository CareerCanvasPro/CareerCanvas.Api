import joi from "joi";

export const integrationValidator = joi
  .object()
  .keys({
    description: joi.string().required().trim(),
    name: joi.string().required().trim(),
    status: joi.string().valid("ACTIVE", "INACTIVE").required(),
  })
  .unknown(false)
  .required();
