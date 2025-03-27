import { prismaClient } from "./config";

export const deleteUserOccupation = async ({
  id,
  occupationId,
}: {
  id: string;
  occupationId: string;
}): Promise<void> => {
  await prismaClient.user.update({
    data: {
      occupations: {
        delete: {
          id: occupationId,
        },
      },
    },
    where: {
      id,
    },
  });
};
