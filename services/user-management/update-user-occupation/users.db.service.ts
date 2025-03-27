import { Occupation } from "@prisma/client";

import { prismaClient } from "./config";

export const updateUserOccupation = async ({
  id,
  occupation,
  occupationId,
}: {
  id: string;
  occupation: Omit<Occupation, "createdAt" | "id" | "updatedAt" | "userId">;
  occupationId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      occupations: {
        update: {
          data: occupation,
          where: {
            id: occupationId,
          },
        },
      },
    },
    where: {
      id,
    },
  });
};
