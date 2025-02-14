import joi from "joi";

export const postCourseSchema = joi
  .object()
  .keys({
    creators: joi.array().items(joi.string().required().trim()).required(),
    duration: joi.number().min(0).required(),
    goal: joi.string().required().trim(),
    level: joi.string().valid("Beginner", "Intermediate", "Expert").required(),
    name: joi.string().required().trim(),
    price: joi.number().min(0).required(),
    rating: joi.number().min(0).max(5).required(),
    ratingCount: joi.number().min(0).required(),
    studentCount: joi.number().min(0).required(),
    topic: joi
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
    url: joi.string().uri({ scheme: ["https"] }),
  })
  .unknown(false);
