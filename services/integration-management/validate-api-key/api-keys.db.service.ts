import { Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const findApiKey = async ({
  hashedValue,
}: {
  hashedValue: string;
}): Promise<{
  apiKey: Prisma.ApiKeyGetPayload<{
    select: {
      expiresAt: true;
      integrationId: true;
      scopes: true;
      status: true;
    };
  }> | null;
}> => {
  const apiKey = await prismaClient.apiKey.findUnique({
    select: {
      expiresAt: true,
      integrationId: true,
      scopes: true,
      status: true,
    },
    where: { hashedValue },
  });

  return { apiKey };
};
