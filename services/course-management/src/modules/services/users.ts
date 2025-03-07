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
      };
    }>;
  }> => {
    const user = await prismaClient.user.findUnique({
      include: {
        goals: true,
        interests: true,
      },
      where: { id },
    });

    return { user };
  };
}
