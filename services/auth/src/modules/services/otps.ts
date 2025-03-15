import { Otp } from "@prisma/client";

import prisma from "./prisma";

export class OtpsDb {
  public createOtp = async ({
    otp,
    username,
  }: {
    otp: string;
    username: string;
  }): Promise<void> => {
    await prisma.otp.create({
      data: {
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        otp,
        username,
      },
    });
  };

  public findOtp = async ({
    otp,
    username,
  }: {
    otp: string;
    username: string;
  }): Promise<{
    foundOtp: Otp;
  }> => {
    const foundOtp = await prisma.otp.findUnique({
      where: {
        otp_username: {
          otp,
          username,
        },
      },
    });

    return { foundOtp };
  };
}
