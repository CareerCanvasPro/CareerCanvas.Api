import joi from "joi";

export const occupationArrayValidator = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        designation: joi.string().required().trim(),
        endDate: joi.date().allow(null),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().required().trim(),
        startDate: joi.date().required(),
      })
      .unknown(false)
      .required()
  )
  .required();
