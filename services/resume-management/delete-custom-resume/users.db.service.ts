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
      customResumes: {
        delete: {
          id: resumeId,
        },
      },
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
