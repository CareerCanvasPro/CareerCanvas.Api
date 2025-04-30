import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "./config";

export const deleteFile = async ({
  key,
}: {
  key: string;
}): Promise<{ httpStatusCode: number }> => {
  const {
    $metadata: { httpStatusCode },
  } = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })
  );

  return { httpStatusCode: httpStatusCode! };
};
