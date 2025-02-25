import joi from "joi";

export const postCoursesSchema = joi
  .array()
  .items(
    joi
      .object()
      .keys({
        authors: joi.array().items(joi.string().required().trim()).required(),
        currency: joi.string().valid("BDT", "USD").required(),
        duration: joi.number().min(0).required(),
        goals: joi.array().items(joi.string().valid("Delegate More Effectively", "Become a Better Listener", "Organize Team-Building Activities", "Provide Constructive Feedback Regularly", "Improve Team Communication", "Take a Non-Tech Course", "Travel to a New Place", "Learn a New Language", "Try a New Hobby", "Start a Journaling Habit", "Develop a Morning Routine", "Build a Strong Professional Network", "Enhance Public Speaking Skills", "Read a Business or Self-Development Book", "Improve Time Management", "Develop a Side Project", "Master a Project Management Tool", "Speak at a Tech Conference", "Write Technical Blog Posts", "Mentor a Junior Developer", "Implement Zero Trust Security", "Set Up a Honeypot", "Get a Cybersecurity Certification", "Perform a Security Audit", "Improve Security Practices", "Build a Personal Data Dashboard", "Implement an AI Chatbot", "Work with Big Data", "Learn SQL and NoSQL Databases", "Train and Deploy a Machine Learning Model", "Automate a Repetitive Task", "Contribute to Open Source", "Improve Code Quality", "Master a New Programming Language", "Build and Deploy a Full-Stack App").required()).required(),
        image: joi.string().uri({
          scheme: ["https"]
        }).required(),
        level: joi.string().valid("Beginner", "Intermediate", "Expert").required(),
        name: joi.string().required().trim(),
        price: joi.number().min(0).required(),
        rating: joi.number().min(0).max(5).required(),
        ratingCount: joi.number().min(0).required(),
        sourceName: joi.string().required().trim(),
        sourceUrl: joi.string().uri({
          scheme: ["https"]
        }).required(),
        studentCount: joi.number().min(0).required(),
        topic: joi.string().valid("Artificial Intelligence", "Cloud Computing", "Data Science", "Environmental Tech", "Robotics", "Software Development").required()
      })
      .required()
      .unknown(false)
  )
  .required();
