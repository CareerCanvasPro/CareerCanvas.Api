import { Job } from "@prisma/client";

import { prismaClient } from "./config";

export const createJobs = async ({
  jobs,
}: {
  jobs: Omit<Job, "id" | "createdAt" | "updatedAt">[];
}): Promise<void> => {
  await prismaClient.job.createMany({
    data: jobs,
  });
};
