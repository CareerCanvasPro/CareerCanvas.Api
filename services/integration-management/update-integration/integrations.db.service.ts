import { Integration } from "@prisma/client";

import { prismaClient } from "./config";

export const updateIntegration = async ({
  integration,
  integrationId,
}: {
  integration: Pick<Integration, "description" | "name" | "status">;
  integrationId: string;
}): Promise<void> => {
  await prismaClient.integration.update({
    data: integration,
    where: { id: integrationId },
  });
};
