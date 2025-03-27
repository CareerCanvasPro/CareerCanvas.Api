import { Certificate, Education } from "@prisma/client";

import { prismaClient } from "./config";

export const updateUserEducation = async ({
  certificate,
  education,
  educationId,
  id,
}: {
  certificate:
    | Pick<Certificate, "key" | "name" | "size" | "type">
    | null
    | undefined;
  education: Omit<Education, "createdAt" | "id" | "updatedAt" | "userId">;
  educationId: string;
  id: string;
}): Promise<void> => {
  const currentCertificate = await prismaClient.certificate.findUnique({
    where: {
      educationId,
    },
  });

  await prismaClient.user.update({
    data: {
      educations: {
        update: {
          data: {
            ...education,
            certificate: certificate
              ? currentCertificate
                ? { update: certificate }
                : { create: certificate }
              : { delete: true },
          },
          where: {
            id: educationId,
          },
        },
      },
    },
    where: {
      id,
    },
  });
};
