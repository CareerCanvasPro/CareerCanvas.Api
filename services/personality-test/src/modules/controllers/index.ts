import { Request, Response } from "express";

// import { DB } from "../../../../../utility/db";
import { AnswersDB, QuestionsDB } from "../services";

export class PersonalityTestController {
  // private readonly db = new DB();

  private readonly answersDB = new AnswersDB();

  private readonly questionsDB = new QuestionsDB();

  public handlePostAnswers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { answers, userId } = req.body;

      const { isUser } = await this.answersDB.checkIsUser({ userId });

      if (isUser) {
        await this.answersDB.updateAnswers({
          answers,
          userId,
        });

        // await this.db.updateItem({
        //   attributes: [{ name: "personalityTestStatus", value: "pending" }],
        //   key: { name: "userID", value: userID },
        //   tableName: "userprofiles",
        // });

        res.status(200).json({
          data: null,
          message: "Answers updated successfully",
        });
      } else {
        await this.answersDB.submitAnswers({
          answers,
          userId,
        });

        // await this.db.updateItem({
        //   attributes: [{ name: "personalityTestStatus", value: "pending" }],
        //   key: { name: "userID", value: userID },
        //   tableName: "userprofiles",
        // });

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

      await this.questionsDB.postQuestions({ questions });

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
      const { questions } = await this.questionsDB.retrieveQuestions();

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
