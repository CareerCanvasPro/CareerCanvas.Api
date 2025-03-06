import { PersonalityType, Prisma } from "@prisma/client";

import { prismaClient } from "../../config";

export class JobsDb {
  public buildQuery = ({
    goals,
    interests,
    personalityType,
  }: {
    goals: string[] | null | undefined;
    interests: string[] | null | undefined;
    personalityType: PersonalityType | null | undefined;
  }): { query: Prisma.JobWhereInput } => {
    const query: Prisma.JobWhereInput = {};

    query.deadline = {
      gte: new Date(),
    };

    if (goals && goals.length) {
      query.goals = {
        some: {
          name: {
            in: goals,
          },
        },
      };
    }

    if (interests && interests.length) {
      query.fields = {
        some: {
          name: {
            in: interests,
          },
        },
      };
    }

    if (personalityType) {
      query.personalityTypes = {
        has: personalityType,
      };
    }

    return { query };
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

  public findJobsByQuery = async ({
    query,
  }: {
    query: Prisma.JobWhereInput;
  }): Promise<{
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
      where: query,
    });

    return { jobs };
  };
}
