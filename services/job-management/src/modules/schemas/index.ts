import joi from "joi";

export const postJobSchema = joi
  .object()
  .keys({
    deadline: joi.number().min(0).required(),
    field: joi
      .string()
      .valid(
        "Artificial Intelligence",
        "Cloud Computing",
        "Data Science",
        "Environmental Tech",
        "Robotics",
        "Software Development"
      )
      .required(),
    goal: joi.string().required().trim(),
    location: joi.string().required().trim(),
    organization: joi.string().required().trim(),
    personality: joi
      .string()
      .regex(/^[EI][NS][FT][JP]$/)
      .required(),
    position: joi.string().required().trim(),
    salaryRange: joi
      .string()
      .regex(/^\d+-\d+[A-Z]{3}$/)
      .required(),
    timing: joi
      .string()
      .regex(/^(?:[01]\d|2[0-3]):[0-5]\d-(?:[01]\d|2[0-3]):[0-5]\d$/)
      .required(),
    type: joi
      .string()
      .valid("Contractual", "Full-time", "Intern", "Part-time")
      .required(),
  })
  .unknown(false);
