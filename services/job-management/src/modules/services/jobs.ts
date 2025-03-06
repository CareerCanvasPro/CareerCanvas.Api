import {
  Job,
  JobLocationType,
  JobType,
  PersonalityType,
  Prisma,
} from "@prisma/client";

import { prismaClient } from "../../config";

export class JobsDb {
  public buildQuery = ({
    goals,
    interests,
    keyword,
    locationTypes,
    personalityType,
    types,
  }: {
    goals: string[] | null | undefined;
    interests: string[] | null | undefined;
    keyword: string | null | undefined;
    locationTypes: JobLocationType[] | null | undefined;
    personalityType: PersonalityType | null | undefined;
    types: JobType[] | null | undefined;
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

    if (keyword) {
      query.OR = [
        {
          fields: {
            some: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        },
        {
          goals: {
            some: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        },
        {
          location: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          organization: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          position: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ];
    }

    if (locationTypes && locationTypes.length) {
      query.locationType = {
        in: locationTypes,
      };
    }

    if (personalityType) {
      query.personalityTypes = {
        has: personalityType,
      };
    }

    if (types && types.length) {
      query.type = {
        in: types,
      };
    }

    return { query };
  };

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
