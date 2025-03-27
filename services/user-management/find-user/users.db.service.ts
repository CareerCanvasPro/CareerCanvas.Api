import { Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const findUser = async ({
  id,
}: {
  id: string;
}): Promise<{
  user: Prisma.UserGetPayload<{
    include: {
      appreciations: true;
      educations: {
        include: {
          certificate: true;
        };
      };
      goals: true;
      interests: true;
      occupations: true;
      personality: true;
      resumes: true;
      skills: true;
    };
  }>;
}> => {
  const user = await prismaClient.user.findUnique({
    include: {
      appreciations: true,
      educations: {
        include: {
          certificate: true,
        },
      },
      goals: true,
      interests: true,
      occupations: true,
      personality: true,
      resumes: true,
      skills: true,
    },
    where: { id },
  });

  return { user: user! };
};
