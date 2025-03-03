import {
  Appreciation,
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
        resumes: true;
        skills: true;
      };
    }>;
  }> => {
    const user = await prismaClient.user.findUnique({
      include: {
        appreciations: true,
        educations: true,
        goals: true,
        interests: true,
        occupations: true,
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
    appreciations: Omit<Appreciation, "id" | "userId">[];
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
    appreciation: Omit<Appreciation, "id" | "userId">;
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
    educations: Omit<Education, "id" | "userId">[];
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
    education: Omit<Education, "id" | "userId">;
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

  // GOALS

  public createUserGoals = async ({
    goals,
    id,
  }: {
    goals: string[];
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        goals: {
          create: goals.map((goal) => ({
            name: goal,
          })),
        },
      },
      where: {
        id,
      },
    });
  };

  public deleteUserGoal = async ({
    goalId,
    id,
  }: {
    goalId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        goals: {
          delete: {
            id: goalId,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserGoal = async ({
    goal,
    goalId,
    id,
  }: {
    goal: string;
    goalId: string;
    id: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        goals: {
          update: {
            data: goal,
            where: {
              id: goalId,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  };

  // INTERESTS

  public createUserInterests = async ({
    id,
    interests,
  }: {
    id: string;
    interests: string[];
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        interests: {
          create: interests.map((interest) => ({
            name: interest,
          })),
        },
      },
      where: {
        id,
      },
    });
  };

  public deleteUserInterest = async ({
    id,
    interestId,
  }: {
    id: string;
    interestId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        interests: {
          delete: {
            id: interestId,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserInterest = async ({
    id,
    interest,
    interestId,
  }: {
    id: string;
    interest: string;
    interestId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        interests: {
          update: {
            data: interest,
            where: {
              id: interestId,
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
    occupations: Omit<Occupation, "id" | "userId">[];
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
    occupation: Omit<Occupation, "id" | "userId">;
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
    resumes: Omit<Resume, "id" | "userId">[];
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
    resume: Omit<Resume, "id" | "userId">;
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

  public createUserSkills = async ({
    id,
    skills,
  }: {
    id: string;
    skills: string[];
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        skills: {
          create: skills.map((skill) => ({
            name: skill,
          })),
        },
      },
      where: {
        id,
      },
    });
  };

  public deleteUserSkill = async ({
    id,
    skillId,
  }: {
    id: string;
    skillId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        skills: {
          delete: {
            id: skillId,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public updateUserSkill = async ({
    id,
    skill,
    skillId,
  }: {
    id: string;
    skill: string;
    skillId: string;
  }): Promise<void> => {
    await prismaClient.user.update({
      data: {
        skills: {
          update: {
            data: skill,
            where: {
              id: skillId,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  };
}
