import { CareerTrend } from "@prisma/client";

import { prismaClient } from "../../config";

export class CareerTrendsDb {
  public createCareerTrend = async ({
    careerTrend,
  }: {
    careerTrend: Pick<CareerTrend, "description" | "image" | "name">;
  }): Promise<void> => {
    await prismaClient.careerTrend.create({
      data: careerTrend,
    });
  };

  public retrieveCareerTrends = async (): Promise<{
    careerTrends: CareerTrend[];
  }> => {
    const careerTrends = await prismaClient.careerTrend.findMany();

    return { careerTrends };
  };
}
