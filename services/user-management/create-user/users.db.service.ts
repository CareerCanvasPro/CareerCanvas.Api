import { Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const createUser = async ({
  user,
}: {
  user: Prisma.UserGetPayload<{
    select: {
      address: true;
      coins: true;
      email: true;
      id: true;
      name: true;
      phone: true;
      profilePicture: true;
      username: true;
    };
  }>;
}): Promise<void> => {
  await prismaClient.user.create({ data: user });
};
