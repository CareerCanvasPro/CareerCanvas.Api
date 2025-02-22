import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim().allow(null),
    dateOfBirth: joi.number().allow(null),
    education: joi
      .array()
      .items(
        joi.object().keys({
          achievements: joi.string().trim().allow(null),
          certificate: joi
            .object()
            .keys({
              name: joi.string(),
              size: joi.number(),
              type: joi.string(),
              uploadedAt: joi.number(),
              url: joi.string().uri({
                scheme: ["https"],
              }),
            })
            .allow(null),
          field: joi.string().trim().allow(null),
          graduationDate: joi.number().allow(null),
          institute: joi.string().trim().allow(null),
          isCurrent: joi.boolean().default(false),
        })
      )
      .allow(null),
    email: joi.string().email().trim().allow(null),
    name: joi.string().trim().allow(null),
    occupation: joi
      .array()
      .items(
        joi.object().keys({
          designation: joi.string().trim().allow(null),
          from: joi.number().allow(null),
          isCurrent: joi.boolean().default(false),
          organization: joi.string().trim().allow(null),
          to: joi.number().allow(null),
        })
      )
      .allow(null),
    phone: joi
      .string()
      .regex(/^\+[1-9]\d{1,14}$/)
      .allow(null),
    profilePicture: joi
      .string()
      .uri({
        scheme: ["https"],
      })
      .allow(null),
    skills: joi.array().items(joi.string()).allow(null),
    userID: joi.string(),
    username: joi.string(),
  })
  .unknown(false);

export const updateProfileSchema = joi
  .object()
  .keys({
    aboutMe: joi.string().trim().allow(null),
    address: joi.string().trim().allow(null),
    appreciations: joi
      .array()
      .items(
        joi.object().keys({
          date: joi.number().allow(null),
          name: joi.string().trim().allow(null),
          organization: joi.string().trim().allow(null),
        })
      )
      .allow(null),
    dateOfBirth: joi.number().allow(null),
    education: joi
      .array()
      .items(
        joi.object().keys({
          achievements: joi.string().trim().allow(null),
          certificate: joi
            .object()
            .keys({
              name: joi.string(),
              size: joi.number(),
              type: joi.string(),
              uploadedAt: joi.number(),
              url: joi.string().uri({
                scheme: ["https"],
              }),
            })
            .allow(null),
          field: joi.string().trim().allow(null),
          graduationDate: joi.number().allow(null),
          institute: joi.string().trim().allow(null),
          isCurrent: joi.boolean().default(false),
        })
      )
      .allow(null),
    fcmToken: joi.string().allow(null),
    interests: joi.array().items(joi.string()).allow(null),
    isEducationDeleted: joi.boolean(),
    isOccupationDeleted: joi.boolean(),
    isSkillsDeleted: joi.boolean(),
    languages: joi.array().items(joi.string()).allow(null),
    name: joi.string().trim().allow(null),
    occupation: joi
      .array()
      .items(
        joi.object().keys({
          designation: joi.string().trim().allow(null),
          from: joi.number().allow(null),
          isCurrent: joi.boolean().default(false),
          organization: joi.string().trim().allow(null),
          to: joi.number().allow(null),
        })
      )
      .allow(null),
    profilePicture: joi
      .string()
      .uri({ scheme: ["https"] })
      .allow(null),
    resumes: joi
      .array()
      .items(
        joi.object().keys({
          name: joi.string(),
          size: joi.number(),
          type: joi.string(),
          uploadedAt: joi.number(),
          url: joi.string().uri({
            scheme: ["https"],
          }),
        })
      )
      .allow(null),
    skills: joi.array().items(joi.string()).allow(null),
  })
  .unknown(false);
