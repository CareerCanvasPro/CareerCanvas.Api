import { Appreciation, Occupation, Prisma, Resume } from "@prisma/client";

import { prismaClient } from "../../config";

export class UsersDb {
  public findUser = async ({
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

    return { user };
  };

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

  // OCCUPATIONS

  public createUserOccupations = async ({
    id,
    occupations,
  }: {
    id: string;
    occupations: Omit<
      Occupation,
      "createdAt" | "id" | "updatedAt" | "userId"
    >[];
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        coins: true,
        isOccupations: true,
      },
      where: {
        id,
      },
    });

    const { coins, isOccupations } = user;

    if (isOccupations) {
      await prismaClient.user.update({
        data: {
          occupations: {
            create: occupations,
          },
        },
        where: {
          id,
        },
      });
    } else {
      const coinsToAdd = 5;

      await prismaClient.user.update({
        data: {
          coins: coins + coinsToAdd,
          isOccupations: true,
          occupations: {
            create: occupations,
          },
        },
        where: {
          id,
        },
      });
    }
  };

  public deleteUserOccupation = async ({
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

  public updateUserOccupation = async ({
    id,
    occupation,
    occupationId,
  }: {
    id: string;
    occupation: Omit<Occupation, "createdAt" | "id" | "updatedAt" | "userId">;
    occupationId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        occupations: {
          update: {
            data: occupation,
            where: {
              id: occupationId,
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
