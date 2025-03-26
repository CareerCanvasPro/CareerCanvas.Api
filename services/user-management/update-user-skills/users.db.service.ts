import { prismaClient } from "./config";

export const updateUserSkills = async ({
  id,
  skills,
}: {
  id: string;
  skills: string[];
}): Promise<void> => {
  const user = await prismaClient.user.findUnique({
    select: {
      coins: true,
      isSkills: true,
      skills: {
        select: {
          name: true,
        },
      },
    },
    where: {
      id,
    },
  });

  const userSkills = user ? user.skills.map((skill) => skill.name) : [];

  const skillsToAdd = skills.filter((skill) => !userSkills.includes(skill));

  const skillsToRemove = userSkills.filter((skill) => !skills.includes(skill));

  const { coins, isSkills } = user!;

  if (isSkills) {
    await prismaClient.user.update({
      data: {
        skills: {
          connectOrCreate: skillsToAdd.map((skill) => ({
            create: {
              name: skill,
            },
            where: {
              name: skill,
            },
          })),
          disconnect: skillsToRemove.map((skill) => ({
            name: skill,
          })),
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
        isSkills: true,
        skills: {
          connectOrCreate: skillsToAdd.map((skill) => ({
            create: {
              name: skill,
            },
            where: {
              name: skill,
            },
          })),
          disconnect: skillsToRemove.map((skill) => ({
            name: skill,
          })),
        },
      },
      where: {
        id,
      },
    });
  }
};
