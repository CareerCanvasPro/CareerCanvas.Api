import { Request, Response } from "express";

import { QuestionsDb } from "../services";

export class PersonalityTestController {
  private readonly questionsDb = new QuestionsDb();

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
}
