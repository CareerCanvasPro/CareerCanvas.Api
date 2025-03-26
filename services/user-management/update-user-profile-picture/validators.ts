import joi from "joi";

export const urlValidator = joi
  .string()
  .uri({
    scheme: ["https"],
  })
  .required();
