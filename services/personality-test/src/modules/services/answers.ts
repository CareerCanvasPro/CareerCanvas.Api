import { prismaClient } from "../../config";

interface IAnswer {
  answer: number;
  questionId: string;
}

interface CheckIsUserParams {
  userId: string;
}

interface SubmitAnswersParams {
  answers: IAnswer[];
  userId: string;
}

interface UpdateAnswersParams {
  answers: IAnswer[];
  userId: string;
}

export class AnswersDB {
  public checkIsUser = async ({
    userId,
  }: CheckIsUserParams): Promise<{
    isUser: boolean;
  }> => {
    const answers = await prismaClient.personalityTestAnswer.findMany({
      where: { userId },
    });

    const isUser = !!answers.length;

    return { isUser };
  };

  public submitAnswers = async ({
    answers,
    userId,
  }: SubmitAnswersParams): Promise<void> => {
    await prismaClient.personalityTestAnswer.createMany({
      data: answers.map(({ answer, questionId }) => ({
        answer,
        questionId,
        userId,
      })),
    });
  };

  public updateAnswers = async ({
    answers,
    userId,
  }: UpdateAnswersParams): Promise<void> => {
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
}
