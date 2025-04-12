import { Integration } from "@prisma/client";

import { prismaClient } from "./config";

export const createIntegration = async ({
  integration,
}: {
  integration: Pick<Integration, "description" | "name">;
}): Promise<void> => {
  await prismaClient.integration.create({
    data: { ...integration, status: "ACTIVE" },
  });
};
