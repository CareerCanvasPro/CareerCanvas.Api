import { prismaClient } from "../../config";

interface IAnswer {
  answer: number;
  questionID: string;
}

interface CheckIsUserParams {
  userID: string;
}

interface SubmitAnswersParams {
  answers: IAnswer[];
  userID: string;
}

interface UpdateAnswersParams {
  answers: IAnswer[];
  userID: string;
}

export class AnswersDB {
  public checkIsUser = async ({
    userID,
  }: CheckIsUserParams): Promise<{
    isUser: boolean;
  }> => {
    const answers = await prismaClient.personality_test_answers.findMany({
      where: { user_id: userID },
    });

    const isUser = !!answers.length;

    return { isUser };
  };

  public submitAnswers = async ({
    answers,
    userID,
  }: SubmitAnswersParams): Promise<void> => {
    await prismaClient.personality_test_answers.createMany({
      data: answers.map(({ answer, questionID }) => ({
        answer: answer,
        question_id: questionID,
        user_id: userID,
      })),
    });
  };

  public updateAnswers = async ({
    answers,
    userID,
  }: UpdateAnswersParams): Promise<void> => {
    await prismaClient.$transaction(
      answers.map(({ answer, questionID }) =>
        prismaClient.personality_test_answers.update({
          data: { answer },
          where: {
            user_id_question_id: { question_id: questionID, user_id: userID },
          },
        })
      )
    );
  };
}
