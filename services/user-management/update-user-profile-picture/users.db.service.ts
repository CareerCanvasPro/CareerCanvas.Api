import { prismaClient } from "./config";

export const updateUserProfilePicture = async ({
  id,
  profilePicture,
}: {
  id: string;
  profilePicture: string;
}): Promise<void> => {
  await prismaClient.user.update({ data: { profilePicture }, where: { id } });
};
