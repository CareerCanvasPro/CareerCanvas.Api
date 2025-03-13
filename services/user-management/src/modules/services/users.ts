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
        educations: true;
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
            certificate: true
          }
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

  public updateUserCoins = async ({
    coins,
    id,
  }: {
    coins: number;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({ data: { coins }, where: { id } });
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

  public createUserAppreciations = async ({
    appreciations,
    id,
  }: {
    appreciations: Omit<
      Appreciation,
      "createdAt" | "id" | "updatedAt" | "userId"
    >[];
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        appreciations: {
          create: appreciations,
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

  public createUserEducations = async ({
    educations,
    id,
  }: {
    educations: Omit<Education, "createdAt" | "id" | "updatedAt" | "userId">[];
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          create: educations,
        },
      },
      where: {
        id,
      },
    });
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
    education,
    educationId,
    id,
  }: {
    education: Omit<Education, "createdAt" | "id" | "updatedAt" | "userId">;
    educationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          update: {
            data: education,
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

  // EDUCATION CERTIFICATE

  public createUserEducationCertificate = async ({
    certificate,
    educationId,
    id,
  }: {
    certificate: Pick<Certificate, "name" | "size" | "type" | "url">;
    educationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          update: {
            data: {
              certificate: {
                create: certificate,
              },
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

  public deleteUserEducationCertificate = async ({
    educationId,
    id,
  }: {
    educationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          update: {
            data: {
              certificate: {
                delete: true,
              },
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

  public updateUserEducationCertificate = async ({
    certificate,
    educationId,
    id,
  }: {
    certificate: Pick<Certificate, "name" | "size" | "type" | "url">;
    educationId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        educations: {
          update: {
            data: {
              certificate: {
                update: certificate,
              },
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

  public createUserResumes = async ({
    id,
    resumes,
  }: {
    id: string;
    resumes: Omit<Resume, "createdAt" | "id" | "updatedAt" | "userId">[];
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        resumes: {
          create: resumes,
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

  public updateUserResume = async ({
    id,
    resume,
    resumeId,
  }: {
    id: string;
    resume: Omit<Resume, "createdAt" | "id" | "updatedAt" | "userId">;
    resumeId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        resumes: {
          update: {
            data: resume,
            where: {
              id: resumeId,
            },
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
  };
}
