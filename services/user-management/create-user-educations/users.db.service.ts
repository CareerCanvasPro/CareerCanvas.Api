import { Certificate, Education } from "@prisma/client";

import { prismaClient } from "./config";

export const createUserEducation = async ({
  certificate,
  education,
  id,
}: {
  certificate:
    | Pick<Certificate, "key" | "name" | "size" | "type">
    | null
    | undefined;
  education: Omit<Education, "createdAt" | "id" | "updatedAt" | "userId">;
  id: string;
}): Promise<void> => {
  const user = await prismaClient.user.findUnique({
    select: {
      coins: true,
      isEducations: true,
    },
    where: {
      id,
    },
  });

  const { coins, isEducations } = user!;

  if (isEducations) {
    await prismaClient.user.update({
      data: {
        educations: {
          create: {
            ...education,
            ...(certificate
              ? {
                  certificate: {
                    create: certificate,
                  },
                }
              : {}),
          },
        },
      },
      where: {
        id,
      },
    });
  } else {
    const coinsToAdd = 5;

    await prismaClient.user.update({
      data: {
        coins: coins + coinsToAdd,
        educations: {
          create: {
            ...education,
            ...(certificate
              ? {
                  certificate: {
                    create: certificate,
                  },
                }
              : {}),
          },
        },
        isEducations: true,
      },
      where: {
        id,
      },
    });
  }
};
