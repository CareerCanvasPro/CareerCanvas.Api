import { PersonalityTestAnswer, PersonalityType } from "@prisma/client";
import { Request, Response } from "express";

import {
  AnswersDb,
  PersonalityTestService,
  QuestionsDb,
  UsersDb,
} from "../services";

export class PersonalityTestController {
  private readonly answersDb = new AnswersDb();

  private readonly personalityTestService = new PersonalityTestService();

  private readonly questionsDb = new QuestionsDb();

  private readonly usersDb = new UsersDb();

  private processAnswers = async ({
    answers,
    id,
  }: {
    answers: PersonalityTestAnswer[];
    id: string;
  }): Promise<void> => {
    const { questions } = await this.questionsDb.retrieveQuestions();

    const { testResult, type } = this.personalityTestService.computeTestResult({
      answers,
      questions,
    });

    const { userPersonalityExists } =
      await this.usersDb.checkIfUserPersonalityExists({ id });

    if (userPersonalityExists) {
      await this.usersDb.updateUserPersonality({
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
      await this.usersDb.createUserPersonality({
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

  public handlePostAnswers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { answers, userId } = req.body;

      const { isUser } = await this.answersDb.checkIsUser({ userId });

      if (isUser) {
        await this.answersDb.updateAnswers({
          answers,
          userId,
        });

        await this.processAnswers({ answers, id: userId });

        res.status(200).json({
          data: null,
          message: "Answers updated successfully",
        });
      } else {
        await this.answersDb.submitAnswers({
          answers,
          userId,
        });

        await this.processAnswers({ answers, id: userId });

        res.status(200).json({
          data: null,
          message: "Answers submitted successfully",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ data: null, message: `${error.name}: ${error.message}` });
    }
  };

  public handlePostQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { questions } = req.body;

      await this.questionsDb.postQuestions({ questions });

      res
        .status(200)
        .json({ data: null, message: "Questions posted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ data: null, message: `${error.name}: ${error.message}` });
    }
  };

  public handleRetrieveQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { questions } = await this.questionsDb.retrieveQuestions();

      if (questions.length) {
        res.status(200).json({
          data: { questions },
          message: "Questions retrieved successfully",
        });
      } else {
        res.status(404).json({ data: null, message: "No questions found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ data: null, message: `${error.name}: ${error.message}` });
    }
  };
}
