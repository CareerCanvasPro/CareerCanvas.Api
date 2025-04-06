import { CareerTrend, Job } from "@prisma/client";
import { Request, Response } from "express";

import { cleanMessage } from "../../utils";
import { jobArraySchema } from "../schemas";
import { CareerTrendsDb, JobsDb } from "../services";

export class JobManagementController {
  private readonly careerTrendsDb = new CareerTrendsDb();

  private readonly jobsDb = new JobsDb();

  public handleCreateCareerTrends = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { careerTrends } = req.body;

      for (const careerTrend of careerTrends as Pick<
        CareerTrend,
        "description" | "image" | "name"
      >[]) {
        await this.careerTrendsDb.createCareerTrend({
          careerTrend,
        });
      }

      res.status(200).json({
        data: null,
        message: "New career trends created successfully",
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

  public handleCreateJobs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { jobs } = req.body;

      const { error, value: validatedJobs } = jobArraySchema.validate(jobs, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((error) =>
          cleanMessage(error.message)
        );

        res.status(400).json({ data: null, message: validationErrors });
      } else {
        for (const job of validatedJobs as Record<string, unknown>[]) {
          const { fields, goals } = job;

          delete job.fields;

          delete job.goals;

          await this.jobsDb.createJob({
            fields: fields as string[],
            goals: goals as string[],
            job: job as Omit<Job, "id" | "createdAt" | "updatedAt">,
          });
        }

        res.status(200).json({
          data: null,
          message: "New jobs created successfully",
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
}
