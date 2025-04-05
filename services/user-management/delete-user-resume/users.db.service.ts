import { prismaClient } from "./config";

export const deleteUserResume = async ({
  id,
  resumeId,
}: {
  id: string;
  resumeId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      resumes: {
        delete: {
          id: resumeId,
        },
      },
    },
    where: {
      id,
    },
  });
};
