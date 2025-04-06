import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createUserEducation } from "./users.db.service";
import { cleanMessage } from "./utils";
import { educationArrayValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { educations } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedEducations } =
      educationArrayValidator.validate(educations, {
        abortEarly: false,
      });

    if (error) {
      const validationErrors = error.details.map((error) =>
        cleanMessage(error.message)
      );

      return {
        body: JSON.stringify({
          data: null,
          message: validationErrors,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
      };
    } else {
      const coinsArray: number[] = [];

      for (const education of validatedEducations) {
        const { certificate } = education;

        delete education?.certificate;

        const { coins } = await createUserEducation({
          certificate,
          education,
          id: userId,
        });

        coinsArray.push(coins);
      }

      return {
        body: JSON.stringify({
          data: { coins: coinsArray[coinsArray.length - 1] },
          message: "Educations created successfully",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
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
