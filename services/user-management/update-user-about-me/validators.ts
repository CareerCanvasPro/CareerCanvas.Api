import joi from "joi";

export const stringValidator = joi.string().required().trim();
