import { PersonalityTestQuestion } from "@prisma/client";

import { prismaClient } from "../../config";

interface IQuestion {
  category: "EI" | "SN" | "TF" | "JP";
  question: string;
  score: 1 | -1;
}

interface PostQuestionsParams {
  questions: IQuestion[];
}

export class QuestionsDb {
  public postQuestions = async ({
    questions,
  }: PostQuestionsParams): Promise<void> => {
    await prismaClient.personalityTestQuestion.createMany({
      data: questions,
    });
  };

  public retrieveQuestions = async (): Promise<{
    questions: PersonalityTestQuestion[];
  }> => {
    const questions = await prismaClient.personalityTestQuestion.findMany();

    return { questions };
  };
}
