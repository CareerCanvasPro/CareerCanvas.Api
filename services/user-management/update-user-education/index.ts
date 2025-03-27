import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateUserEducation } from "./users.db.service";
import { cleanMessage } from "./utils";
import { educationValidator } from "./validators";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = JSON.parse(event.requestContext.authorizer?.user);

    const { educationId } = event.pathParameters!;

    const { education } = JSON.parse(event.body ? event.body : "");

    const { error, value: validatedEducation } = educationValidator.validate(
      education,
      {
        abortEarly: false,
      }
    );

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
      const { certificate } = validatedEducation;

      delete validatedEducation?.certificate;

      await updateUserEducation({
        certificate,
        education: validatedEducation,
        educationId: educationId!,
        id: userId,
      });

      return {
        body: JSON.stringify({
          data: null,
          message: "Education updated successfully",
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
