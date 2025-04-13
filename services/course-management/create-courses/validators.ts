import joi from "joi";

export const courseArrayValidator = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        description: joi.string().required().trim(),
        name: joi.string().required().trim(),
        sourceName: joi.string().required().trim(),
        sourceUrl: joi
          .string()
          .uri({
            scheme: ["https"],
          })
          .required(),
        tags: joi.array().items(joi.string().trim()).required(),
      })
      .unknown(false)
      .required()
  )
  .required();
