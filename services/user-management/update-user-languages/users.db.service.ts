import { prismaClient } from "./config";

export const updateUserLanguages = async ({
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

  const userLanguages = user
    ? user.languages.map((language) => language.name)
    : [];

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
