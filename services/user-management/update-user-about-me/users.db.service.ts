import { prismaClient } from "./config";

export const updateUserAboutMe = async ({
  aboutMe,
  id,
}: {
  aboutMe: string;
  id: string;
}): Promise<void> => {
  await prismaClient.user.update({ data: { aboutMe }, where: { id } });
};
