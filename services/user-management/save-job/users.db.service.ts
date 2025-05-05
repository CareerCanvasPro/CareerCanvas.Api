import { prismaClient } from "./config";

export const saveJob = async ({
  id,
  jobId,
}: {
  id: string;
  jobId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      savedJobs: {
        connect: {
          id: jobId,
        },
      },
    },
    where: {
      id,
    },
  });
};
