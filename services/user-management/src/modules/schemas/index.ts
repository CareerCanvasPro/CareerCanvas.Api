import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim(),
    contact: joi.string().trim(),
    dateOfBirth: joi.date(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.date(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    email: joi.string().email(),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.date(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.date(),
      })
    ),
    phone: joi.string(), // add regex for phone number
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    skills: joi.array().items(joi.string().trim()),
    userID: joi.string().required(),
    username: joi.string(),
  })
  .or("email", "phone")
  .unknown();

export const updateProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim(),
    contact: joi.string().trim(),
    dateOfBirth: joi.date(),
    education: joi.array().items(
      joi.object().keys({
        achievements: joi.string().trim(),
        certificate: joi.string().uri({ scheme: ["https"] }),
        field: joi.string().trim(),
        graduationDate: joi.date(),
        institute: joi.string().trim(),
        isCurrent: joi.boolean().default(false),
      })
    ),
    name: joi.string().trim(),
    occupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        from: joi.date(),
        isCurrent: joi.boolean().default(false),
        organization: joi.string().trim(),
        to: joi.date(),
      })
    ),
    profilePicture: joi.string().uri({ scheme: ["https"] }),
    skills: joi.array().items(joi.string().trim()),
  })
  .unknown();
