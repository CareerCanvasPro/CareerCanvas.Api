export function cleanMessage(message: string): string {
  const cleanedMessage = message.split('"').join("");

  return cleanedMessage[0].toUpperCase() + cleanedMessage.slice(1);
}
