import { Resume } from "@prisma/client";

import { prismaClient } from "./config";

export const createUserResume = async ({
  id,
  resume,
  resumeId,
}: {
  id: string;
  resume: Pick<Resume, "key" | "name" | "size" | "type">;
  resumeId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      resumes: {
        create: { ...resume, id: resumeId },
      },
    },
    where: {
      id,
    },
  });
};

export const updateUserResume = async ({
  id,
  resume,
  resumeId,
}: {
  id: string;
  resume: Pick<Resume, "key" | "name" | "size" | "type">;
  resumeId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      resumes: {
        update: {
          data: resume,
          where: {
            id: resumeId,
          },
        },
      },
    },
    where: {
      id,
    },
  });
};
