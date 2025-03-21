import { prismaClient } from "./config";

export const createOtp = async ({
  otp,
  username,
}: {
  otp: string;
  username: string;
}): Promise<void> => {
  await prismaClient.otp.create({
    data: {
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      otp,
      username,
    },
  });
};
