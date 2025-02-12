import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim(),
    contact: joi.string().trim(),
    dateOfBirth: joi.number(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.number(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.number(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.number(),
      })
    ),
    phone: joi.string(), // add regex for phone number
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    skills: joi.array().items(joi.string().trim()),
    username: joi.string(),
  })
  .unknown(false);

export const updateProfileSchema = joi
  .object()
  .keys({
    aboutMe: joi.string().trim(),
    address: joi.string().trim(),
    appreciations: joi.array().items(
      joi.object().keys({
        date: joi.number(),
        name: joi.string().trim(),
        organization: joi.string().trim(),
      })
    ),
    contact: joi.string().trim(),
    dateOfBirth: joi.number(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.number(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    fcmToken: joi.string(),
    goals: joi.array().items(joi.string().trim()),
    interests: joi.array().items(joi.string()),
    languages: joi.array().items(joi.string().trim()),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.number(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.number(),
      })
    ),
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    resumes: joi.array().items(
      joi.object().keys({
        name: joi.string(),
        size: joi.number(),
        type: joi.string(),
        uploadedAt: joi.number(),
        url: joi.string().uri({
          scheme: ["https"],
        }),
      })
    ),
    skills: joi.array().items(joi.string().trim()),
  })
  .unknown(false);
