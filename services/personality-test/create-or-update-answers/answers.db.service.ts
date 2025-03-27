import { prismaClient } from "./config";

export const checkIfAnswersExist = async ({
  userId,
}: {
  userId: string;
}): Promise<{
  answersExist: boolean;
}> => {
  const answers = await prismaClient.personalityTestAnswer.findMany({
    where: { userId },
  });

  const answersExist = !!answers.length;

  return { answersExist };
};

export const createAnswers = async ({
  answers,
  userId,
}: {
  answers: {
    answer: number;
    questionId: string;
  }[];
  userId: string;
}): Promise<void> => {
  await prismaClient.personalityTestAnswer.createMany({
    data: answers.map(({ answer, questionId }) => ({
      answer,
      questionId,
      userId,
    })),
  });
};

export const updateAnswers = async ({
  answers,
  userId,
}: {
  answers: {
    answer: number;
    questionId: string;
  }[];
  userId: string;
}): Promise<void> => {
  await prismaClient.$transaction(
    answers.map(({ answer, questionId }) =>
      prismaClient.personalityTestAnswer.update({
        data: { answer },
        where: {
          questionId_userId: { questionId, userId },
        },
      })
    )
  );
};
