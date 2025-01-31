import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    currentEducation: joi.object().keys({
      expectedGraduationDate: joi.date(),
      fieldOfEducation: joi.string().trim(),
      instituteName: joi.string().trim(),
    }),
    currentOccupation: joi.object().keys({
      designation: joi.string().trim(),
      organizationName: joi.string().trim(),
      workFrom: joi.date(),
      workTill: joi.date(),
    }),
    dateOfBirth: joi.date(),
    email: joi.string().required(),
    fullName: joi.string().trim(),
    hardSkills: joi.array().items(joi.string().trim()),
    pastEducation: joi.array().items(
      joi.object().keys({
        fieldOfEducation: joi.string().trim(),
        graduationDate: joi.date(),
        instituteName: joi.string().trim(),
      })
    ),
    pastOccupation: joi.array().items(
      joi.object().keys({
        designation: joi.string().trim(),
        organizationName: joi.string().trim(),
        workFrom: joi.date(),
        workTill: joi.date(),
      })
    ),
    softSkills: joi.array().items(joi.string().trim()),
    userID: joi.string().required(),
  })
  .unknown();
