import { prismaClient } from "./config";

export const deleteUser = async ({ id }: { id: string }): Promise<void> => {
  await prismaClient.user.delete({ where: { id } });
};
