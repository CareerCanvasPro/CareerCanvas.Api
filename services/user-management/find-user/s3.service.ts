import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client } from "./config";

export const getPresignedUrl = async ({
  key,
}: {
  key: string;
}): Promise<{ presignedUrl: string }> => {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    }),
    { expiresIn: 3600 }
  );

  return { presignedUrl };
};
