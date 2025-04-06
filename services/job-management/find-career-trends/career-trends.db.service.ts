import { CareerTrend } from "@prisma/client";

import { prismaClient } from "./config";

export const findCareerTrends = async (): Promise<{
  careerTrends: CareerTrend[];
}> => {
  const careerTrends = await prismaClient.careerTrend.findMany();

  return { careerTrends };
};
