import { prismaClient } from "./config";

export const updateUserName = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<void> => {
  await prismaClient.user.update({ data: { name }, where: { id } });
};
