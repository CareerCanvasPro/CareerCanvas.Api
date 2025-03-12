import joi from "joi";

export const createProfileSchema = joi
  .object()
  .keys({
    address: joi.string().trim().allow(null),
    email: joi.string().email().trim().allow(null),
    name: joi.string().trim().allow(null),
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
    userID: joi.string().required(),
    username: joi.string().required(),
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
    goals: joi
      .array()
      .items(
        joi
          .string()
          .valid(
            "Delegate More Effectively",
            "Become a Better Listener",
            "Organize Team-Building Activities",
            "Provide Constructive Feedback Regularly",
            "Improve Team Communication",
            "Take a Non-Tech Course",
            "Travel to a New Place",
            "Learn a New Language",
            "Try a New Hobby",
            "Start a Journaling Habit",
            "Develop a Morning Routine",
            "Build a Strong Professional Network",
            "Enhance Public Speaking Skills",
            "Read a Business or Self-Development Book",
            "Improve Time Management",
            "Develop a Side Project",
            "Master a Project Management Tool",
            "Speak at a Tech Conference",
            "Write Technical Blog Posts",
            "Mentor a Junior Developer",
            "Implement Zero Trust Security",
            "Set Up a Honeypot",
            "Get a Cybersecurity Certification",
            "Perform a Security Audit",
            "Improve Security Practices",
            "Build a Personal Data Dashboard",
            "Implement an AI Chatbot",
            "Work with Big Data",
            "Learn SQL and NoSQL Databases",
            "Train and Deploy a Machine Learning Model",
            "Automate a Repetitive Task",
            "Contribute to Open Source",
            "Improve Code Quality",
            "Master a New Programming Language",
            "Build and Deploy a Full-Stack App"
          )
      )
      .allow(null),
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
