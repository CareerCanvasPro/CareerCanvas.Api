import { Prisma } from "@prisma/client";

export const shuffleCourses = ({
  courses,
}: {
  courses: Prisma.CourseGetPayload<{
    include: {
      authors: true;
      goals: true;
      topic: true;
    };
  }>[];
}): {
  shuffledCourses: Prisma.CourseGetPayload<{
    include: {
      authors: true;
      goals: true;
      topic: true;
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
