import { prismaClient } from "../../config";

export class UsersDb {
  public checkIsUser = async ({
    username,
  }: {
    username: string;
  }): Promise<{
    isUser: boolean;
  }> => {
    const user = await prismaClient.user.findUnique({ where: { username } });

    const isUser = !!user;

    return { isUser };
  };
}
