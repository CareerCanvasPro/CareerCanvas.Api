import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { config } from "../../config";

interface DeleteFileParams {
  key: string;
}

interface UploadFileParams {
  body: Buffer<ArrayBufferLike>;
  contentType: string;
  key: string;
}

export class S3 {
  private readonly BUCKET_NAME = config.aws.s3.bucketName;

  private readonly s3Client = new S3Client({
    region: config.aws.region,
  });

  // private getContentType({ extension }: GetContentTypeParams): string {
  //   switch (extension) {
  //     case ".jpg":
  //     case ".jpeg":
  //       return "image/jpeg";
  //     case ".png":
  //       return "image/png";
  //     case ".webp":
  //       return "image/webp";
  //     case ".heic":
  //       return "image/heic";
  //     case ".pdf":
  //       return "application/pdf";
  //     // Add more cases for other file formats if needed
  //     default:
  //       throw new Error("Unsupported file format");
  //   }
  // }

  public async deleteFile({
    key,
  }: DeleteFileParams): Promise<{ httpStatusCode: number }> {
    const {
      $metadata: { httpStatusCode },
    } = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
      })
    );

    return { httpStatusCode };
  }

  public async putFile({
    body,
    contentType,
    key,
  }: UploadFileParams): Promise<{ httpStatusCode: number; key: string }> {
    const {
      $metadata: { httpStatusCode },
    } = await this.s3Client.send(
      new PutObjectCommand({
        ACL: "public-read",
        Body: body,
        Bucket: this.BUCKET_NAME,
        ContentType: contentType,
        Key: key,
      })
    );

    return { httpStatusCode, key };
  }

  // public async getPresignedUrls(
  //   keys: string[] // list of file paths in bucket
  // ): Promise<string[]> {
  //   return await Promise.all(
  //     keys.map(async (key) => {
  //       return await getSignedUrl(
  //         this.s3Client,
  //         new GetObjectCommand({
  //           Bucket: this.BUCKET_NAME,
  //           Key: key,
  //         }),
  //         { expiresIn: 3600 }
  //       );
  //     })
  //   );
  // }
}
