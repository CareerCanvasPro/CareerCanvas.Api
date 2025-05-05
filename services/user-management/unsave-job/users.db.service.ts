import { prismaClient } from "./config";

export const unsaveJob = async ({
  id,
  jobId,
}: {
  id: string;
  jobId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      savedJobs: {
        disconnect: {
          id: jobId,
        },
      },
    },
    where: {
      id,
    },
  });
};
