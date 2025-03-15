import { User } from "@prisma/client";

import prisma from "./prisma";

export class UsersDb {
  public findUser = async ({
    username,
  }: {
    username: string;
  }): Promise<{
    user: User;
  }> => {
    const user = await prisma.user.findUnique({ where: { username } });

    return { user };
  };
}
