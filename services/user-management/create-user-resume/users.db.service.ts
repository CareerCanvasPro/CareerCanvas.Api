import { Resume } from "@prisma/client";

import { prismaClient } from "./config";

export const createUserResume = async ({
  id,
  resume,
}: {
  id: string;
  resume: Omit<Resume, "createdAt" | "updatedAt" | "userId">;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      resumes: {
        create: resume,
      },
    },
    where: {
      id,
    },
  });
};
