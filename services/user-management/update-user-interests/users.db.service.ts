import { prismaClient } from "./config";

export const updateUserInterests = async ({
  id,
  interests,
}: {
  id: string;
  interests: string[];
}): Promise<{ coins: number }> => {
  const user = await prismaClient.user.findUnique({
    select: {
      coins: true,
      interests: {
        select: {
          name: true,
        },
      },
      isInterests: true,
    },
    where: {
      id,
    },
  });

  const userInterests = user
    ? user.interests.map((interest) => interest.name)
    : [];

  const interestsToAdd = interests.filter(
    (interest) => !userInterests.includes(interest)
  );

  const interestsToRemove = userInterests.filter(
    (interest) => !interests.includes(interest)
  );

  const { coins, isInterests } = user!;

  if (isInterests) {
    await prismaClient.user.update({
      data: {
        interests: {
          connectOrCreate: interestsToAdd.map((interest) => ({
            create: {
              name: interest,
            },
            where: {
              name: interest,
            },
          })),
          disconnect: interestsToRemove.map((interest) => ({
            name: interest,
          })),
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
        interests: {
          connectOrCreate: interestsToAdd.map((interest) => ({
            create: {
              name: interest,
            },
            where: {
              name: interest,
            },
          })),
          disconnect: interestsToRemove.map((interest) => ({
            name: interest,
          })),
        },
        isInterests: true,
      },
      where: {
        id,
      },
    });

    return { coins: coins + coinsToAdd };
  }
};
