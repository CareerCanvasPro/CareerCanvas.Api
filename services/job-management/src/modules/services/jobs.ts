import { Job, Prisma } from "@prisma/client";

import { prismaClient } from "../../config";

export class JobsDb {
  public createJob = async ({
    job,
    fields,
    goals,
  }: {
    job: Omit<Job, "id" | "createdAt" | "updatedAt">;
    fields: string[];
    goals: string[];
  }): Promise<void> => {
    await prismaClient.job.create({
      data: {
        ...job,
        fields: {
          connectOrCreate: fields.map((field) => ({
            create: {
              name: field,
            },
            where: {
              name: field,
            },
          })),
        },
        goals: {
          connectOrCreate: goals.map((goal) => ({
            create: {
              name: goal,
            },
            where: {
              name: goal,
            },
          })),
        },
      },
    });
  };

  public findAllJobs = async (): Promise<{
    jobs: Prisma.JobGetPayload<{
      include: {
        fields: true;
        goals: true;
      };
    }>[];
  }> => {
    const jobs = await prismaClient.job.findMany({
      include: {
        fields: true,
        goals: true,
      },
    });

    return { jobs };
  };
}
