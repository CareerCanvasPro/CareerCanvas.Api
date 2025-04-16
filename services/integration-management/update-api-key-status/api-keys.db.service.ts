import { ApiKeyStatus } from "@prisma/client";

import { prismaClient } from "./config";

export const updateApiKeyStatus = async ({
  apiKeyId,
  status,
}: {
  apiKeyId: string;
  status: ApiKeyStatus;
}): Promise<void> => {
  await prismaClient.apiKey.update({
    data: {
      status,
    },
    where: {
      id: apiKeyId,
    },
  });
};
