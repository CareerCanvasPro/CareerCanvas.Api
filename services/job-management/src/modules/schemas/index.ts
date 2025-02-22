import joi from "joi";

export const postJobsSchema = joi
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
          .required(),
        currency: joi.string().valid("BDT", "USD").required(),
        deadline: joi.number().min(0).required(),
        fields: joi
          .array()
          .items(
            joi
              .string()
              .valid(
                "Artificial Intelligence",
                "Cloud Computing",
                "Data Science",
                "Environmental Tech",
                "Robotics",
                "Software Development"
              )
              .required()
          )
          .required(),
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
              .required()
          )
          .required(),
        location: joi.string().required().trim(),
        locationType: joi
          .string()
          .valid("Hybrid", "On-site", "Remote")
          .required(),
        organization: joi.string().required().trim(),
        personalityTypes: joi
          .array()
          .items(
            joi
              .string()
              .regex(/^[EI][NS][FT][JP]$/)
              .required()
          )
          .required(),
        position: joi.string().required().trim(),
        salary: joi.number().min(0).required(),
        salaryMax: joi.number().min(0),
        salaryTime: joi.string().valid("Annum", "Month").required(),
        type: joi
          .string()
          .valid("Contractual", "Full-time", "Intern", "Part-time")
          .required(),
      })
      .required()
      .unknown(false)
  )
  .required();
