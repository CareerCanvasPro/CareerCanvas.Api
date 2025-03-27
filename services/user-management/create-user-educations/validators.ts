import joi from "joi";

export const educationArrayValidator = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        achievements: joi.string().trim().allow(null),
        certificate: joi
          .object()
          .keys({
            key: joi.string().required(),
            name: joi.string().required(),
            size: joi.number().required(),
            type: joi.string().required(),
          })
          .unknown(false)
          .allow(null),
        field: joi.string().required().trim(),
        graduationDate: joi.date().allow(null),
        institute: joi.string().required().trim(),
        isCurrent: joi.boolean().default(false),
      })
      .unknown(false)
      .required()
  )
  .required();
