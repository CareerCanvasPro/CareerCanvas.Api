import { prismaClient } from "../../config";

interface IQuestion {
  category: "EI" | "SN" | "TF" | "JP";
  question: string;
  score: 1 | -1;
}

interface PostQuestionsParams {
  questions: IQuestion[];
}

export class QuestionsDB {
  public postQuestions = async ({
    questions,
  }: PostQuestionsParams): Promise<void> => {
    await prismaClient.personality_test_questions.createMany({
      data: questions,
    });
  };

  public retrieveQuestions = async (): Promise<{
    questions: Record<string, number | string>[];
  }> => {
    const questions = await prismaClient.personality_test_questions.findMany();

    return { questions };
  };
}
