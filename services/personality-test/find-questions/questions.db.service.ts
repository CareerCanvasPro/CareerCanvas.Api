import { PersonalityTestQuestion } from "@prisma/client";

import { prismaClient } from "./config";

export const findQuestions = async (): Promise<{
  questions: PersonalityTestQuestion[];
}> => {
  const questions = await prismaClient.personalityTestQuestion.findMany();

  return { questions };
};
