import { prismaClient } from "./config";

export const updateUserAddress = async ({
  address,
  id,
}: {
  address: string;
  id: string;
}): Promise<void> => {
  await prismaClient.user.update({ data: { address }, where: { id } });
};
