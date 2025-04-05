import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "./config";

export const putFile = async ({
  acl,
  body,
  contentType,
  key,
}: {
  acl: ObjectCannedACL;
  body: Buffer;
  contentType: string;
  key: string;
}): Promise<{ httpStatusCode: number; key: string }> => {
  const {
    $metadata: { httpStatusCode },
  } = await s3Client.send(
    new PutObjectCommand({
      ACL: acl,
      Body: body,
      Bucket: process.env.S3_BUCKET,
      ContentType: contentType,
      Key: key,
    })
  );

  return { httpStatusCode: httpStatusCode!, key };
};
