export const cleanMessage = (message: string): string => {
  return message.split('"').join("");
};
