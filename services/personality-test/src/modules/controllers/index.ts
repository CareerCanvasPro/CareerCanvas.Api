import { Request, Response } from "express";

import { DB } from "../../../../../utility/db";
import { QuestionsDB, ResultsDB } from "../services";

export class PersonalityTestController {
  private readonly db = new DB();

  private readonly questionsDB = new QuestionsDB();

  private readonly resultsDB = new ResultsDB();

  public handleEnterResult = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { result, userID } = req.body;

      const { result: user } = await this.resultsDB.getResult({ userID });

      if (user) {
        const { httpStatusCode } = await this.resultsDB.updateResult({
          result,
          userID,
        });

        await this.db.updateItem({
          attributes: [{ name: "personalityTestStatus", value: "pending" }],
          key: { name: "userID", value: userID },
          tableName: "userprofiles",
        });

        res.status(httpStatusCode).json({
          data: null,
          message: "Result updated successfully",
        });
      } else {
        const { httpStatusCode } = await this.resultsDB.putResult({
          result,
          userID,
        });

        await this.db.updateItem({
          attributes: [{ name: "personalityTestStatus", value: "pending" }],
          key: { name: "userID", value: userID },
          tableName: "userprofiles",
        });

        res.status(httpStatusCode).json({
          data: null,
          message: "Result entered successfully",
        });
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
