import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { DB } from "../../../../../utility/db";
import { cleanMessage } from "../../utils";
import { postJobSchema } from "../schemas";
import { CareerTrendsDB, JobsDB } from "../services";

interface FilterJobsForRecommendationParams {
  goals: string[] | undefined;
  interests: string[] | undefined;
  jobs: Record<string, unknown>[];
  personalityTestResult: string | undefined;
  skills: string[] | undefined;
}

interface FilterJobsForSearchParams {
  jobs: Record<string, unknown>[];
  keyword: string | undefined;
}

interface ShuffleJobsParams {
  jobs: Record<string, unknown>[];
}

export class JobManagementController {
  private readonly db = new DB();

  private readonly careerTrendsDB = new CareerTrendsDB();

  private readonly jobsDB = new JobsDB();

  private filterJobsForRecommendation = ({
    goals,
    interests,
    jobs,
    personalityTestResult,
    skills,
  }: FilterJobsForRecommendationParams): {
    filteredJobs: Record<string, unknown>[];
  } => {
    const filteredJobs = jobs.filter((job) => {
      const flags: boolean[] = [];

      if (goals && goals.length) {
        flags.push(
          goals.some((goal) =>
            goal.toLowerCase().includes((job.goal as string).toLowerCase())
          )
        );
      }

      if (interests && interests.length) {
        flags.push(
          interests.some((interest) =>
            interest
              .toLowerCase()
              .includes((job.interest as string).toLowerCase())
          )
        );
      }

      if (personalityTestResult) {
        flags.push(personalityTestResult === job.personality);
      }

      if (skills && skills.length) {
        flags.push(
          skills.some((skill) =>
            skill.toLowerCase().includes((job.skill as string).toLowerCase())
          )
        );
      }

      return flags.every((flag) => flag === true);
    });

    return { filteredJobs };
  };

  private filterJobsForSearch = ({
    jobs,
    keyword,
  }: FilterJobsForSearchParams): {
    filteredJobs: Record<string, unknown>[];
  } => {
    const filteredJobs = jobs.filter((job) => {
      const flags: boolean[] = [];

      if (keyword) {
        flags.push(
          (job.goal as string).toLowerCase().includes(keyword) ||
            (job.interest as string).toLowerCase().includes(keyword) ||
            (job.location as string).toLowerCase().includes(keyword) ||
            (job.organization as string).toLowerCase().includes(keyword) ||
            (job.position as string).toLowerCase().includes(keyword) ||
            (job.type as string).toLowerCase().includes(keyword)
        );
      }

      return flags.every((flag) => flag === true);
    });

    return { filteredJobs };
  };

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

  public handlePostJob = async (req: Request, res: Response): Promise<void> => {
    try {
      delete req.body.exp;

      delete req.body.iat;

      const { error, value } = postJobSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        const { httpStatusCode } = await this.jobsDB.putJob({
          job: { ...value, jobID: uuidv4() },
        });

        res.status(httpStatusCode).json({
          data: null,
          message: "New job posted successfully",
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
      const { userID } = req.body;

      const { item: user } = await this.db.getItem({
        key: { name: "userID", value: userID as string },
        tableName: "userprofiles",
      });

      if (user) {
        const { goals, interests, personalityTestResult, skills } = user;

        const { httpStatusCode, jobs } = await this.jobsDB.getAllJobs();

        const { filteredJobs } = this.filterJobsForRecommendation({
          goals: goals as string[] | undefined,
          interests: interests as string[] | undefined,
          jobs,
          personalityTestResult: personalityTestResult as string | undefined,
          skills: skills as string[] | undefined,
        });

        const { shuffledJobs } = this.shuffleJobs({ jobs: filteredJobs });

        if (shuffledJobs.length > 10) {
          res.status(httpStatusCode).json({
            data: { jobs: shuffledJobs.slice(0, 10) },
            message: "Recommended jobs retrieved successfully",
          });
        } else {
          res.status(httpStatusCode).json({
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
      const { keyword } = req.query;

      const { httpStatusCode, jobs } = await this.jobsDB.getAllJobs();

      const { filteredJobs } = this.filterJobsForSearch({
        jobs,
        keyword: keyword as string | undefined,
      });

      res.status(httpStatusCode).json({
        data: { jobs: filteredJobs },
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
