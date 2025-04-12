import { Integration } from "@prisma/client";

import { prismaClient } from "./config";

export const findIntegration = async ({
  integrationId,
}: {
  integrationId: string;
}): Promise<{ integration: Integration }> => {
  const integration = await prismaClient.integration.findUnique({
    where: { id: integrationId },
  });

  return { integration: integration! };
};
