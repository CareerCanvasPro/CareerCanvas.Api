export const cleanMessage = (message: string): string =>
  message.split('"').join("");
