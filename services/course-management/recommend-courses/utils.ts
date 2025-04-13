import { Prisma } from "@prisma/client";

export const generateKeywords = ({
  string,
}: {
  string: string;
}): { keywords: string[] } => {
  const keywords = string.split(" ");

  return { keywords };
};

export const shuffleCourses = ({
  courses,
}: {
  courses: Prisma.CourseGetPayload<{
    include: {
      tags: true;
    };
  }>[];
}): {
  shuffledCourses: Prisma.CourseGetPayload<{
    include: {
      tags: true;
    };
  }>[];
} => {
  const shuffledCourses = [...courses];

  for (let i = shuffledCourses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledCourses[i], shuffledCourses[j]] = [
      shuffledCourses[j],
      shuffledCourses[i],
    ];
  }

  return { shuffledCourses };
};
