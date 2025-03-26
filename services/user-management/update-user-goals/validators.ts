import joi from "joi";

export const stringArrayValidator = joi
  .array()
  .items(joi.string().required().trim())
  .required();
