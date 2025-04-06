import { Job, JobLocationType, JobType, Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const buildQuery = ({
  keyword,
  locationTypes,
  types,
}: {
  keyword: string | undefined;
  locationTypes: JobLocationType[] | undefined;
  types: JobType[] | undefined;
}): { query: Prisma.JobWhereInput } => {
  const query: Prisma.JobWhereInput = {};

  query.deadline = {
    gte: new Date(),
  };

  if (keyword) {
    query.OR = [
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

  if (types && types.length) {
    query.type = {
      in: types,
    };
  }

  return { query };
};

export const findJobsByQuery = async ({
  query,
}: {
  query: Prisma.JobWhereInput;
}): Promise<{
  jobs: Job[];
}> => {
  const jobs = await prismaClient.job.findMany({
    where: query,
  });

  return { jobs };
};
