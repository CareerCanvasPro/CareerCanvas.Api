import { Occupation } from "@prisma/client";

import { prismaClient } from "./config";

export const createUserOccupations = async ({
  id,
  occupations,
}: {
  id: string;
  occupations: Omit<Occupation, "createdAt" | "id" | "updatedAt" | "userId">[];
}): Promise<{ coins: number }> => {
  const user = await prismaClient.user.findUnique({
    select: {
      coins: true,
      isOccupations: true,
    },
    where: {
      id,
    },
  });

  const { coins, isOccupations } = user!;

  if (isOccupations) {
    await prismaClient.user.update({
      data: {
        occupations: {
          create: occupations,
        },
      },
      where: {
        id,
      },
    });

    return { coins };
  } else {
    const coinsToAdd = 5;

    await prismaClient.user.update({
      data: {
        coins: coins + coinsToAdd,
        isOccupations: true,
        occupations: {
          create: occupations,
        },
      },
      where: {
        id,
      },
    });

    return { coins: coins + coinsToAdd };
  }
};
