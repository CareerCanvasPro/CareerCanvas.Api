import { Prisma } from "@prisma/client";

import { prismaClient } from "./config";

export const findUser = async ({
  id,
}: {
  id: string;
}): Promise<{
  user: Prisma.UserGetPayload<{
    include: {
      interests: true;
      occupations: true;
      skills: true;
    };
  }>;
}> => {
  const user = await prismaClient.user.findUnique({
    include: {
      interests: true,
      occupations: true,
      skills: true,
    },
    where: { id },
  });

  return { user: user! };
};
