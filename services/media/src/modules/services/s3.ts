import { readFileSync } from "fs";
import { extname } from "path";

import {
  //   CopyObjectCommand,
  GetObjectCommand,
  //   HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { config } from "../../config";
import { getContentType } from "../../utils";

export class S3 {
  private readonly BUCKET_NAME = config.aws.s3.bucketName;
  private readonly REGION = config.aws.region;
  private readonly s3Client = new S3Client({
    region: this.REGION,
  });

  public async uploadImage(
    bucketPath: string,
    localPath: string
  ): Promise<PutObjectCommandOutput> {
    const content = readFileSync(localPath);

    const extension = extname(localPath).toLowerCase();

    const contentType = getContentType(extension);

    return await this.s3Client.send(
      new PutObjectCommand({
        Body: content,
        Bucket: this.BUCKET_NAME,
        ContentType: contentType,
        Key: bucketPath,
      })
    );
  }

  public async getPresignedUrls(
    keys: string[] // list of file paths in bucket
  ): Promise<string[]> {
    return await Promise.all(
      keys.map(async (key) => {
        return await getSignedUrl(
          this.s3Client,
          new GetObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: key,
          }),
          { expiresIn: 3600 }
        );
      })
    );
  }
}
