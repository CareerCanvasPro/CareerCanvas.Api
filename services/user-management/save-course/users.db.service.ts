import { prismaClient } from "./config";

export const saveCourse = async ({
  courseId,
  id,
}: {
  courseId: string;
  id: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      savedCourses: {
        connect: {
          id: courseId,
        },
      },
    },
    where: {
      id,
    },
  });
};
