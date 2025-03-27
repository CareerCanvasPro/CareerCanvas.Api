import { Personality } from "@prisma/client";

import { prismaClient } from "./config";

export const checkIfUserPersonalityExists = async ({
  id,
}: {
  id: string;
}): Promise<{ userPersonalityExists: boolean }> => {
  const user = await prismaClient.user.findUnique({
    select: {
      personality: true,
    },
    where: {
      id,
    },
  });

  const userPersonalityExists = !!user?.personality;

  return { userPersonalityExists };
};

export const createUserPersonality = async ({
  id,
  personality,
}: {
  id: string;
  personality: Pick<
    Personality,
    "testResultEI" | "testResultSN" | "testResultTF" | "testResultJP" | "type"
  >;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      personality: {
        create: personality,
      },
    },
    where: {
      id,
    },
  });
};

export const updateUserPersonality = async ({
  id,
  personality,
}: {
  id: string;
  personality: Pick<
    Personality,
    "testResultEI" | "testResultSN" | "testResultTF" | "testResultJP" | "type"
  >;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      personality: {
        update: personality,
      },
    },
    where: {
      id,
    },
  });
};
