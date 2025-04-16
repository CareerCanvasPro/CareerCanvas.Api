import { ApiKeyStatus, Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const buildQuery = ({
  integrationId,
  statuses,
}: {
  integrationId: string;
  statuses: ApiKeyStatus[] | undefined;
}): { query: Prisma.ApiKeyWhereInput } => {
  const query: Prisma.ApiKeyWhereInput = { integrationId };

  if (statuses && statuses.length) {
    query.status = {
      in: statuses,
    };
  }

  return { query };
};

export const findApiKeysByQuery = async ({
  query,
}: {
  query: Prisma.ApiKeyWhereInput;
}): Promise<{
  apiKeys: Prisma.ApiKeyGetPayload<{
    select: {
      createdAt: true;
      expiresAt: true;
      id: true;
      scopes: true;
      status: true;
      updatedAt: true;
    };
  }>[];
}> => {
  const apiKeys = await prismaClient.apiKey.findMany({
    select: {
      createdAt: true,
      expiresAt: true,
      id: true,
      scopes: true,
      status: true,
      updatedAt: true,
    },
    where: query,
  });

  return { apiKeys };
};
