import joi from "joi";

export const userSchema = joi
  .object()
  .keys({
    address: joi.string().required().trim(),
    email: joi.string().email().trim(),
    name: joi.string().required().trim(),
    phone: joi.string().regex(/^\+[1-9]\d{1,14}$/),
    profilePicture: joi
      .string()
      .uri({
        scheme: ["https"],
      })
      .required(),
    userId: joi.string().required(),
    username: joi.string().required(),
  })
  .or("email", "phone")
  .unknown(false)
  .required();

export const stringArraySchema = joi
  .array()
  .items(joi.string().required().trim())
  .required();

export const stringSchema = joi.string().required().trim();

export const urlSchema = joi
  .string()
  .uri({
    scheme: ["https"],
  })
  .required();

// APPRECIATIONS

export const appreciationArraySchema = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        date: joi.date().allow(null),
        name: joi.string().required().trim(),
        organization: joi.string().required().trim(),
      })
      .unknown(false)
      .required()
  )
  .required();

export const appreciationSchema = joi
  .object()
  .keys({
    date: joi.date().allow(null),
    name: joi.string().required().trim(),
    organization: joi.string().required().trim(),
  })
  .unknown(false)
  .required();

// EDUCATIONS

export const educationArraySchema = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        achievements: joi.string().trim().allow(null),
        field: joi.string().required().trim(),
        graduationDate: joi.date().allow(null),
        institute: joi.string().required().trim(),
        isCurrent: joi.boolean().default(false),
      })
      .unknown(false)
      .required()
  )
  .required();

export const educationSchema = joi
  .object()
  .keys({
    achievements: joi.string().trim().allow(null),
    field: joi.string().required().trim(),
    graduationDate: joi.date().allow(null),
    institute: joi.string().required().trim(),
    isCurrent: joi.boolean().default(false),
  })
  .unknown(false)
  .required();

// EDUCATION CERTIFICATE

export const educationCertificateSchema = joi
  .object()
  .keys({
    name: joi.string().required(),
    size: joi.number().required(),
    type: joi.string().required(),
    uploadedAt: joi.date().required(),
    url: joi
      .string()
      .uri({
        scheme: ["https"],
      })
      .required(),
  })
  .unknown(false)
  .required();

// OCCUPATIONS

export const occupationArraySchema = joi
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

export const occupationSchema = joi
  .object()
  .keys({
    designation: joi.string().required().trim(),
    endDate: joi.date().allow(null),
    isCurrent: joi.boolean().default(false),
    organization: joi.string().required().trim(),
    startDate: joi.date().required(),
  })
  .unknown(false)
  .required();

// RESUMES

export const resumeArraySchema = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        name: joi.string().required(),
        size: joi.number().required(),
        type: joi.string().required(),
        uploadedAt: joi.date().required(),
        url: joi
          .string()
          .uri({
            scheme: ["https"],
          })
          .required(),
      })
      .unknown(false)
      .required()
  )
  .required();

export const resumeSchema = joi
  .object()
  .keys({
    name: joi.string().required(),
    size: joi.number().required(),
    type: joi.string().required(),
    uploadedAt: joi.date().required(),
    url: joi
      .string()
      .uri({
        scheme: ["https"],
      })
      .required(),
  })
  .unknown(false)
  .required();
