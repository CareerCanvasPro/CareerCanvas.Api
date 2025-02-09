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
        res.status(409).json({ data: null, message: "User already exists" });
      } else {
        const { httpStatusCode } = await this.resultsDB.putResult({
          result,
          userID,
        });

        const { updatedItem: updatedUser } = await this.db.updateItem({
          attributes: [
            { name: "personalityTestResult", value: "" },
            { name: "personalityTestStatus", value: "pending" },
          ],
          key: { name: "userID", value: userID },
          tableName: "userprofiles",
        });

        const { personalityTestStatus } = updatedUser;

        res.status(httpStatusCode).json({
          data: { personalityTestStatus },
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

  public handleRetrieveResult = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userID } = req.query;

      const { httpStatusCode, result } = await this.resultsDB.getResult({
        userID: userID as string,
      });

      if (result) {
        res
          .status(httpStatusCode)
          .json({ data: result, message: "Result retrieved successfully" });
      } else {
        res.status(404).json({ data: null, message: "Result not found" });
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

  public handleUpdateResult = async (
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

        const { updatedItem: updatedUser } = await this.db.updateItem({
          attributes: [
            { name: "personalityTestResult", value: "" },
            { name: "personalityTestStatus", value: "pending" },
          ],
          key: { name: "userID", value: userID },
          tableName: "userprofiles",
        });

        const { personalityTestStatus } = updatedUser;

        res.status(httpStatusCode).json({
          data: { personalityTestStatus },
          message: "Result updated successfully",
        });
      } else {
        res.status(404).json({ data: null, message: "User not found" });
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
