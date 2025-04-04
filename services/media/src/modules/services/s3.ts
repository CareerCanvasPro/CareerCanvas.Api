import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { config } from "../../config";

export class S3 {
  private readonly BUCKET = config.s3.bucket;

  private readonly s3Client = new S3Client({
    region: config.aws.region,
  });

  public deleteFile = async ({
    key,
  }: {
    key: string;
  }): Promise<{ httpStatusCode: number }> => {
    const {
      $metadata: { httpStatusCode },
    } = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.BUCKET,
        Key: key,
      })
    );

    return { httpStatusCode };
  };

  public getUrl = ({ key }: { key: string }): { url: string } => {
    const url = `https://${this.BUCKET}.s3.${config.aws.region}.amazonaws.com/${key}`;

    return { url };
  };

  public putFile = async ({
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
    } = await this.s3Client.send(
      new PutObjectCommand({
        ACL: acl,
        Body: body,
        Bucket: this.BUCKET,
        ContentType: contentType,
        Key: key,
      })
    );

    return { httpStatusCode, key };
  };
}
