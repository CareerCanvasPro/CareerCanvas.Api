import { Personality } from "@prisma/client";

import { prismaClient } from "../../config";

export class UsersDb {
  public createUserPersonality = async ({
    id,
    personality,
  }: {
    id: string;
    personality: Pick<Personality, "testStatus">;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        personality: {
          create: personality,
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserPersonality = async ({
    id,
    personality,
  }: {
    id: string;
    personality: Pick<Personality, "testStatus">;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        personality: {
          update: personality,
        },
      },
      where: {
        id,
      },
    });
  };
}
