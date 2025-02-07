import { Request, Response } from "express";

import { QuestionsDB } from "../services";

export class PersonalityTestController {
  private readonly questionsDB = new QuestionsDB();

  public handleRetrieveQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { count, httpStatusCode, questions } =
        await this.questionsDB.scanQuestions();

      if (count) {
        res.status(httpStatusCode).json({
          data: { count, questions },
          message: "Questions retrieved successfully",
        });
      } else {
        res.status(404).json({ data: null, message: "No questions found" });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };
}
