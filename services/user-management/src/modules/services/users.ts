import {
  Appreciation,
  Certificate,
  Education,
  Occupation,
  Prisma,
  Resume,
} from "@prisma/client";

import { prismaClient } from "../../config";

export class UsersDb {
  public createUser = async ({
    user,
  }: {
    user: Prisma.UserGetPayload<{
      select: {
        address: true;
        coins: true;
        email: true;
        id: true;
        name: true;
        phone: true;
        profilePicture: true;
        username: true;
      };
    }>;
  }): Promise<void> => {
    await prismaClient.user.create({ data: user });
  };

  public deleteUser = async ({ id }: { id: string }): Promise<void> => {
    await prismaClient.user.delete({ where: { id } });
  };

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

  public updateUserAboutMe = async ({
    aboutMe,
    id,
  }: {
    aboutMe: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { aboutMe }, where: { id } });
  };

  public updateUserAddress = async ({
    address,
    id,
  }: {
    address: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { address }, where: { id } });
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

  public updateUserName = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { name }, where: { id } });
  };

  public updateUserProfilePicture = async ({
    id,
    profilePicture,
  }: {
    id: string;
    profilePicture: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { profilePicture }, where: { id } });
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

  // EDUCATIONS

  public createUserEducation = async ({
    certificate,
    education,
    id,
  }: {
    certificate:
      | Pick<Certificate, "key" | "name" | "size" | "type">
      | null
      | undefined;
    education: Omit<Education, "createdAt" | "id" | "updatedAt" | "userId">;
    id: string;
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        coins: true,
        isEducations: true,
      },
      where: {
        id,
      },
    });

    const { coins, isEducations } = user;

    if (isEducations) {
      await prismaClient.user.update({
        data: {
          educations: {
            create: {
              ...education,
              ...(certificate
                ? {
                    certificate: {
                      create: certificate,
                    },
                  }
                : {}),
            },
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
          educations: {
            create: {
              ...education,
              ...(certificate
                ? {
                    certificate: {
                      create: certificate,
                    },
                  }
                : {}),
            },
          },
          isEducations: true,
        },
        where: {
          id,
        },
      });
    }
  };

  public deleteUserEducation = async ({
    educationId,
    id,
  }: {
    educationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          delete: {
            id: educationId,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserEducation = async ({
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

  // GOALS

  public updateUserGoals = async ({
    goals,
    id,
  }: {
    goals: string[];
    id: string;
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        goals: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    const userGoals = user.goals.map((goal) => goal.name);

    const goalsToAdd = goals.filter((goal) => !userGoals.includes(goal));

    const goalsToRemove = userGoals.filter((goal) => !goals.includes(goal));

    await prismaClient.user.update({
      data: {
        goals: {
          connectOrCreate: goalsToAdd.map((goal) => ({
            create: {
              name: goal,
            },
            where: {
              name: goal,
            },
          })),
          disconnect: goalsToRemove.map((goal) => ({
            name: goal,
          })),
        },
      },
      where: {
        id,
      },
    });
  };

  // INTERESTS

  public updateUserInterests = async ({
    id,
    interests,
  }: {
    id: string;
    interests: string[];
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        interests: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    const userInterests = user.interests.map((interest) => interest.name);

    const interestsToAdd = interests.filter(
      (interest) => !userInterests.includes(interest)
    );

    const interestsToRemove = userInterests.filter(
      (interest) => !interests.includes(interest)
    );

    await prismaClient.user.update({
      data: {
        interests: {
          connectOrCreate: interestsToAdd.map((interest) => ({
            create: {
              name: interest,
            },
            where: {
              name: interest,
            },
          })),
          disconnect: interestsToRemove.map((interest) => ({
            name: interest,
          })),
        },
      },
      where: {
        id,
      },
    });
  };

  // LANGUAGES

  public updateUserLanguages = async ({
    id,
    languages,
  }: {
    id: string;
    languages: string[];
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        languages: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    const userLanguages = user.languages.map((language) => language.name);

    const languagesToAdd = languages.filter(
      (language) => !userLanguages.includes(language)
    );

    const languagesToRemove = userLanguages.filter(
      (language) => !languages.includes(language)
    );

    await prismaClient.user.update({
      data: {
        languages: {
          connectOrCreate: languagesToAdd.map((language) => ({
            create: {
              name: language,
            },
            where: {
              name: language,
            },
          })),
          disconnect: languagesToRemove.map((language) => ({
            name: language,
          })),
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

  // SKILLS

  public updateUserSkills = async ({
    id,
    skills,
  }: {
    id: string;
    skills: string[];
  }): Promise<void> => {
    const user = await prismaClient.user.findUnique({
      select: {
        coins: true,
        isSkills: true,
        skills: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    const userSkills = user.skills.map((skill) => skill.name);

    const skillsToAdd = skills.filter((skill) => !userSkills.includes(skill));

    const skillsToRemove = userSkills.filter(
      (skill) => !skills.includes(skill)
    );

    const { coins, isSkills } = user;

    if (isSkills) {
      await prismaClient.user.update({
        data: {
          skills: {
            connectOrCreate: skillsToAdd.map((skill) => ({
              create: {
                name: skill,
              },
              where: {
                name: skill,
              },
            })),
            disconnect: skillsToRemove.map((skill) => ({
              name: skill,
            })),
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
          isSkills: true,
          skills: {
            connectOrCreate: skillsToAdd.map((skill) => ({
              create: {
                name: skill,
              },
              where: {
                name: skill,
              },
            })),
            disconnect: skillsToRemove.map((skill) => ({
              name: skill,
            })),
          },
        },
        where: {
          id,
        },
      });
    }
  };
}
