import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { buildQuery, findJobsByQuery } from "./jobs.db.service";
import { findUser } from "./users.db.service";
import { shuffleJobs } from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { user } = await findUser({ id: userId });

    if (user) {
      const { address, interests, occupations, skills } = user;

      const { query } = buildQuery({
        address,
        interests: interests.map((interest) => interest.name),
        occupations,
        skills: skills.map((skill) => skill.name),
      });

      const { jobs } = await findJobsByQuery({
        query,
      });

      const { shuffledJobs } = shuffleJobs({ jobs });

      if (shuffledJobs.length > 10) {
        const jobs = shuffledJobs.slice(0, 10);

        jobs.forEach((job) => {
          job["isSaved"] = job.id === userId;
        });

        return {
          body: JSON.stringify({
            data: { jobs },
            message: "Recommended jobs retrieved successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      } else {
        shuffledJobs.forEach((job) => {
          job["isSaved"] = job.id === userId;
        });

        return {
          body: JSON.stringify({
            data: { jobs: shuffledJobs },
            message: "Recommended jobs retrieved successfully",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
        };
      }
    } else {
      return {
        body: JSON.stringify({ data: null, message: "Profile not found" }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 404,
      };
    }
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: error.$metadata.httpStatusCode,
      };
    } else {
      return {
        body: JSON.stringify({
          data: null,
          message: `${error.name}: ${error.message}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500,
      };
    }
  }
};
