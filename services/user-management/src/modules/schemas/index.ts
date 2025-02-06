import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim(),
    contact: joi.string().trim(),
    dateOfBirth: joi.string(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.string(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    email: joi.string().email(),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.string(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.string(),
      })
    ),
    phone: joi.string(), // add regex for phone number
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    skills: joi.array().items(joi.string().trim()),
    userID: joi.string().required(),
    username: joi.string(),
  })
  .or("email", "phone")
  .unknown(false);

export const updateProfileSchema = joi
  .object()
  .keys({
    aboutMe: joi.string().trim(),
    address: joi.string().trim(),
    appreciations: joi.array().items(
      joi.object().keys({
        date: joi.string(),
        name: joi.string().trim(),
        organization: joi.string().trim(),
      })
    ),
    contact: joi.string().trim(),
    dateOfBirth: joi.string(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.string(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    followers: joi.number(),
    following: joi.number(),
    languages: joi.array().items(joi.string().trim()),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.string(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.string(),
      })
    ),
    points: joi.number(),
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    resumes: joi.array().items(
      joi.object().keys({
        name: joi.string(),
        size: joi.number(),
        type: joi.string(),
        uploadedAt: joi.string(),
        url: joi.string().uri({
          scheme: ["https"],
        }),
      })
    ),
    skills: joi.array().items(joi.string().trim()),
  })
  .unknown(false);
