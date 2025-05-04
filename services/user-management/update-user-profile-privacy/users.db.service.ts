import { prismaClient } from "./config";

export const updateUserProfilePrivacy = async ({
  id,
  isPrivate,
}: {
  id: string;
  isPrivate: boolean;
}): Promise<void> => {
  await prismaClient.user.update({ data: { isPrivate }, where: { id } });
};
