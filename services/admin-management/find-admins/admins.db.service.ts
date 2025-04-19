import { Admin } from "@prisma/client";

import { prismaClient } from "./config";

export const findAdmins = async (): Promise<{
  admins: Pick<Admin, "email" | "id" | "name">[];
}> => {
  const admins = await prismaClient.admin.findMany({
    select: { email: true, id: true, name: true },
  });

  return { admins };
};
