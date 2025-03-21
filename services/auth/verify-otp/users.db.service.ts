import { User } from "@prisma/client";

import { prismaClient } from "./config";

export const findUser = async ({
  username,
}: {
  username: string;
}): Promise<{
  user: User;
}> => {
  const user = await prismaClient.user.findUnique({ where: { username } });

  return { user };
};
