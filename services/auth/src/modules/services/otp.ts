import { prismaClient } from "../../config";

export class OtpsDb {
  public createOtp = async ({
    otp,
    username,
  }: {
    otp: string;
    username: string;
  }): Promise<void> => {
    await prismaClient.otp.create({
      data: {
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        otp,
        username,
      },
    });
  };

  public scanOtps = async ({
    attribute,
  }: ScanOtpsParams): Promise<{
    httpStatusCode: number;
    otps: Record<string, unknown>[];
  }> => {
    const {
      $metadata: { httpStatusCode },
      Items: Otps,
    } = await this.dynamoDBClient.send(
      new ScanCommand({
        ExpressionAttributeNames: {
          "#field": attribute.name,
        },
        ExpressionAttributeValues: {
          ":value": marshall({
            value: attribute.value,
          }).value,
        },
        FilterExpression: "#field = :value",
        TableName: this.tableName,
      })
    );

    const otps = Otps.map((otp) => unmarshall(otp));

    return { httpStatusCode, otps };
  };
}
