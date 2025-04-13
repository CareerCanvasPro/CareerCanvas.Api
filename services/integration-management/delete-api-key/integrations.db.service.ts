import { prismaClient } from "./config";

export const deleteApiKey = async ({
  apiKeyId,
}: {
  apiKeyId: string;
}): Promise<void> => {
  await prismaClient.apiKey.delete({
    where: {
      id: apiKeyId,
    },
  });
};
