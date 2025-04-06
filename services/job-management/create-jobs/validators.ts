import joi from "joi";

export const jobArrayValidator = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        companyLogo: joi
          .string()
          .uri({
            scheme: ["https"],
          })
          .allow(""),
        deadline: joi.date().required(),
        location: joi.string().required().trim(),
        locationType: joi
          .string()
          .valid("HYBRID", "ON_SITE", "REMOTE")
          .required(),
        organization: joi.string().trim().allow(""),
        position: joi.string().required().trim(),
        type: joi
          .string()
          .valid("CONTRACTUAL", "FULL_TIME", "INTERN", "PART_TIME")
          .required(),
        url: joi
          .string()
          .uri({
            scheme: ["https"],
          })
          .allow(""),
      })
      .unknown(false)
      .required()
  )
  .required();
