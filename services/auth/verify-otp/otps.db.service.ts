import { Otp } from "@prisma/client";

import { prismaClient } from "./config";

export const findOtp = async ({
  otp,
  username,
}: {
  otp: string;
  username: string;
}): Promise<{
  foundOtp: Otp;
}> => {
  const foundOtp = await prismaClient.otp.findUnique({
    where: {
      otp_username: {
        otp,
        username,
      },
    },
  });

  return { foundOtp };
};
