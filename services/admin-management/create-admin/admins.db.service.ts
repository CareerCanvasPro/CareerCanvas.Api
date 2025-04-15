import { Admin } from "@prisma/client";

import { prismaClient } from "./config";

export const createAdmin = async ({
  admin,
}: {
  admin: Pick<Admin, "email" | "hashedPassword" | "name">;
}): Promise<void> => {
  await prismaClient.admin.create({ data: admin });
};

export const findAdmin = async ({
  email,
}: {
  email: string;
}): Promise<{
  admin: Admin | null;
}> => {
  const admin = await prismaClient.admin.findUnique({ where: { email } });

  return { admin };
};
