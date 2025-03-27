import {
  PersonalityTestAnswer,
  PersonalityTestQuestion,
  PersonalityType,
} from "@prisma/client";

import { findQuestions } from "./questions.db.service";
import {
  checkIfUserPersonalityExists,
  createUserPersonality,
  updateUserPersonality,
} from "./users.db.service";

const computeTestResult = ({
  answers,
  questions,
}: {
  answers: PersonalityTestAnswer[];
  questions: PersonalityTestQuestion[];
}): {
  testResult: {
    EI: number;
    JP: number;
    SN: number;
    TF: number;
  };
  type: string;
} => {
  const mbti = {
    E: 0,
    F: 0,
    I: 0,
    J: 0,
    N: 0,
    P: 0,
    S: 0,
    T: 0,
  };

  for (const { answer, questionId } of answers) {
    const question = questions.find((question) => question.id === questionId);

    if (question) {
      const score = answer * question.score;

      switch (question.category) {
        case "EI":
          if (score >= 0) {
            mbti.E += score;
          } else {
            mbti.I -= score;
          }

          break;
        case "SN":
          if (score >= 0) {
            mbti.S += score;
          } else {
            mbti.N -= score;
          }

          break;
        case "TF":
          if (score >= 0) {
            mbti.T += score;
          } else {
            mbti.F -= score;
          }

          break;
        case "JP":
          if (score >= 0) {
            mbti.J += score;
          } else {
            mbti.P -= score;
          }

          break;
      }
    }
  }

  const testResult = {
    EI: mbti.E / (mbti.E + mbti.I),
    JP: mbti.J / (mbti.J + mbti.P),
    SN: mbti.S / (mbti.S + mbti.N),
    TF: mbti.T / (mbti.T + mbti.F),
  };

  const EI = mbti.E >= mbti.I ? "E" : "I";

  const SN = mbti.S >= mbti.N ? "S" : "N";

  const TF = mbti.T >= mbti.F ? "T" : "F";

  const JP = mbti.J >= mbti.P ? "J" : "P";

  const type = `${EI}${SN}${TF}${JP}`;

  return { testResult, type };
};

export const processAnswers = async ({
  answers,
  id,
}: {
  answers: PersonalityTestAnswer[];
  id: string;
}): Promise<void> => {
  const { questions } = await findQuestions();

  const { testResult, type } = computeTestResult({
    answers,
    questions,
  });

  const { userPersonalityExists } = await checkIfUserPersonalityExists({ id });

  if (userPersonalityExists) {
    await updateUserPersonality({
      id,
      personality: {
        testResultEI: testResult.EI,
        testResultJP: testResult.JP,
        testResultSN: testResult.SN,
        testResultTF: testResult.TF,
        type: type as PersonalityType,
      },
    });
  } else {
    await createUserPersonality({
      id,
      personality: {
        testResultEI: testResult.EI,
        testResultJP: testResult.JP,
        testResultSN: testResult.SN,
        testResultTF: testResult.TF,
        type: type as PersonalityType,
      },
    });
  }
};
