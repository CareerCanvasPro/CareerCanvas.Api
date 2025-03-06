import { Prisma } from "@prisma/client";

import { prismaClient } from "../../config";

export class UsersDb {
  public findUser = async ({
    id,
  }: {
    id: string;
  }): Promise<{
    user: Prisma.UserGetPayload<{
      include: {
        goals: true;
        interests: true;
        personality: true;
      };
    }>;
  }> => {
    const user = await prismaClient.user.findUnique({
      include: {
        goals: true,
        interests: true,
        personality: true,
      },
      where: { id },
    });

    return { user };
  };
}
