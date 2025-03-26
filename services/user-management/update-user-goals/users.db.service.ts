import { prismaClient } from "./config";

export const updateUserGoals = async ({
  goals,
  id,
}: {
  goals: string[];
  id: string;
}): Promise<void> => {
  const user = await prismaClient.user.findUnique({
    select: {
      goals: {
        select: {
          name: true,
        },
      },
    },
    where: {
      id,
    },
  });

  const userGoals = user ? user.goals.map((goal) => goal.name) : [];

  const goalsToAdd = goals.filter((goal) => !userGoals.includes(goal));

  const goalsToRemove = userGoals.filter((goal) => !goals.includes(goal));

  await prismaClient.user.update({
    data: {
      goals: {
        connectOrCreate: goalsToAdd.map((goal) => ({
          create: {
            name: goal,
          },
          where: {
            name: goal,
          },
        })),
        disconnect: goalsToRemove.map((goal) => ({
          name: goal,
        })),
      },
    },
    where: {
      id,
    },
  });
};
