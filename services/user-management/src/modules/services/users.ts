import { Appreciation, Resume } from "@prisma/client";

import { prismaClient } from "../../config";

export class UsersDb {
  private updateUserCoins = async ({
    coinsToAdd,
    id,
  }: {
    coinsToAdd: number;
    id: string;
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        coins: true,
      },
      where: {
        id,
      },
    });

    const { coins } = user;

    await prismaClient.user.update({
      data: { coins: coins + coinsToAdd },
      where: { id },
    });
  };

  public updateUserFcmToken = async ({
    fcmToken,
    id,
  }: {
    fcmToken: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { fcmToken }, where: { id } });
  };

  // APPRECIATIONS

  public createUserAppreciation = async ({
    appreciation,
    id,
  }: {
    appreciation: Omit<
      Appreciation,
      "createdAt" | "id" | "updatedAt" | "userId"
    >;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        appreciations: {
          create: appreciation,
        },
      },
      where: {
        id,
      },
    });
  };

  public deleteUserAppreciation = async ({
    appreciationId,
    id,
  }: {
    appreciationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        appreciations: {
          delete: {
            id: appreciationId,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserAppreciation = async ({
    appreciation,
    appreciationId,
    id,
  }: {
    appreciation: Omit<
      Appreciation,
      "createdAt" | "id" | "updatedAt" | "userId"
    >;
    appreciationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        appreciations: {
          update: {
            data: appreciation,
            where: {
              id: appreciationId,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  };

  // RESUMES

  public createUserResume = async ({
    id,
    resume,
  }: {
    id: string;
    resume: Omit<Resume, "createdAt" | "updatedAt" | "userId">;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        resumes: {
          create: resume,
        },
      },
      where: {
        id,
      },
    });
  };

  public deleteUserResume = async ({
    id,
    resumeId,
  }: {
    id: string;
    resumeId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        resumes: {
          delete: {
            id: resumeId,
          },
        },
      },
      where: {
        id,
      },
    });
  };
}
