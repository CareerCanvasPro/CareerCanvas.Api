import { object, string } from "joi";

export const authSchema = object().keys({
  email: string().email().required(),
});

export const confirmAuthSchema = object().keys({
  token: string().required(),
});
