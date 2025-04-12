import { ApiKey } from "@prisma/client";

import { prismaClient } from "./config";

export const createApiKey = async ({
  apiKey,
  integrationId,
}: {
  apiKey: Pick<ApiKey, "expiresAt" | "hashedValue" | "scopes">;
  integrationId: string;
}): Promise<void> => {
  await prismaClient.integration.update({
    data: {
      apiKeys: {
        create: { ...apiKey, status: "ACTIVE" },
      },
    },
    where: {
      id: integrationId,
    },
  });
};
