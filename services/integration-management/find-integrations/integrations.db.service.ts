import { Integration, IntegrationStatus, Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const buildQuery = ({
  keyword,
  statuses,
}: {
  keyword: string | undefined;
  statuses: IntegrationStatus[] | undefined;
}): { query: Prisma.IntegrationWhereInput } => {
  const query: Prisma.IntegrationWhereInput = {};

  if (keyword) {
    query.name = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  if (statuses && statuses.length) {
    query.status = {
      in: statuses,
    };
  }

  return { query };
};

export const findIntegrationsByQuery = async ({
  query,
}: {
  query: Prisma.IntegrationWhereInput;
}): Promise<{
  integrations: Integration[];
}> => {
  const integrations = await prismaClient.integration.findMany({
    where: query,
  });

  return { integrations };
};
