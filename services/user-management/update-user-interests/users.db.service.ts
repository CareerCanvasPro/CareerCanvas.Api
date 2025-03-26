import { prismaClient } from "./config";

export const updateUserInterests = async ({
  id,
  interests,
}: {
  id: string;
  interests: string[];
}): Promise<void> => {
  const user = await prismaClient.user.findUnique({
    select: {
      interests: {
        select: {
          name: true,
        },
      },
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
};
