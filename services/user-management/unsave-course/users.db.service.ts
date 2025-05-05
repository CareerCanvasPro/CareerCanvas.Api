import { prismaClient } from "./config";

export const unsaveCourse = async ({
  courseId,
  id,
}: {
  courseId: string;
  id: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      savedCourses: {
        disconnect: {
          id: courseId,
        },
      },
    },
    where: {
      id,
    },
  });
};
