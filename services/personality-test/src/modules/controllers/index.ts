import { Request, Response } from "express";

import { AnswersDb, QuestionsDb, UsersDb } from "../services";

export class PersonalityTestController {
  private readonly answersDb = new AnswersDb();

  private readonly questionsDb = new QuestionsDb();

  private readonly usersDb = new UsersDb();

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

        await this.usersDb.updateUserPersonality({
          id: userId,
          personality: { testStatus: "PENDING" },
        });

        res.status(200).json({
          data: null,
          message: "Answers updated successfully",
        });
      } else {
        await this.answersDb.submitAnswers({
          answers,
          userId,
        });

        await this.usersDb.createUserPersonality({
          id: userId,
          personality: { testStatus: "PENDING" },
        });

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
          data: { count: questions.length, questions },
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
