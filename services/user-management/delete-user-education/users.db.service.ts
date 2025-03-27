import { prismaClient } from "./config";

export const deleteUserEducation = async ({
  educationId,
  id,
}: {
  educationId: string;
  id: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      educations: {
        delete: {
          id: educationId,
        },
      },
    },
    where: {
      id,
    },
  });
};
