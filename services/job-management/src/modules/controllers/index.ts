import { JobLocationType, JobType } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { cleanMessage } from "../../utils";
import { postJobsSchema } from "../schemas";
import { CareerTrendsDB, JobsDb, UsersDb } from "../services";

interface ShuffleJobsParams {
  jobs: Record<string, unknown>[];
}

export class JobManagementController {
  private readonly careerTrendsDB = new CareerTrendsDB();

  private readonly jobsDb = new JobsDb();

  private readonly usersDb = new UsersDb();

  private shuffleJobs = ({
    jobs,
  }: ShuffleJobsParams): { shuffledJobs: Record<string, unknown>[] } => {
    const shuffledJobs = [...jobs];

    for (let i = shuffledJobs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledJobs[i], shuffledJobs[j]] = [shuffledJobs[j], shuffledJobs[i]];
    }

    return { shuffledJobs };
  };

  public handlePostJobs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      delete req.body.exp;

      delete req.body.iat;

      const { error, value } = postJobsSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        (value as Record<string, unknown>[]).forEach(
          async (value) =>
            await this.jobsDB.putJob({
              job: { ...value, jobID: uuidv4() },
            })
        );

        res.status(200).json({
          data: null,
          message: "New jobs posted successfully",
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

  public handleRetrieveCareerTrends = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { careers, httpStatusCode } =
        await this.careerTrendsDB.getCareerTrends();

      if (careers) {
        res.status(httpStatusCode).json({
          data: { careers },
          message: "Career trends retrieved successfully",
        });
      } else {
        res
          .status(404)
          .json({ data: null, message: "Career trends not found" });
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

  public handleRetrieveRecommendedJobs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const { user } = await this.usersDb.findUser({ id: userId });

      if (user) {
        const { goals, interests, personality } = user;

        const { query } = this.jobsDb.buildQuery({
          goals: goals ? goals.map((goal) => goal.name) : null,
          interests: interests
            ? interests.map((interest) => interest.name)
            : null,
          personalityType: personality ? personality.type : null,
        });

        const { jobs } = await this.jobsDb.findJobsByQuery({
          query,
        });

        const { shuffledJobs } = this.shuffleJobs({ jobs });

        if (shuffledJobs.length > 10) {
          res.status(200).json({
            data: { jobs: shuffledJobs.slice(0, 10) },
            message: "Recommended jobs retrieved successfully",
          });
        } else {
          res.status(200).json({
            data: { jobs: shuffledJobs },
            message: "Recommended jobs retrieved successfully",
          });
        }
      } else {
        res.status(404).json({ data: user, message: "Profile not found" });
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

  public handleSearchJobs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { keyword, locationType, type } = req.query;

      const { query } = this.jobsDb.buildQuery({
        keyword: keyword as string | undefined,
        locationTypes: locationType
          ? Array.isArray(locationType)
            ? (locationType as JobLocationType[])
            : [locationType as JobLocationType]
          : null,
        types: type
          ? Array.isArray(type)
            ? (type as JobType[])
            : [type as JobType]
          : null,
      });

      const { jobs } = await this.jobsDb.findJobsByQuery({
        query,
      });

      res.status(200).json({
        data: { jobs },
        message: "Search results retrieved successfully",
      });
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
