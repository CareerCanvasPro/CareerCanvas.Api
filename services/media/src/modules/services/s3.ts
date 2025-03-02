import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { config } from "../../config";

interface DeleteFileParams {
  key: string;
}

interface GetSignedUrlParams {
  key: string;
}

interface GetUrlParams {
  key: string;
}

interface UploadFileParams {
  acl: ObjectCannedACL;
  body: Buffer;
  contentType: string;
  key: string;
}

export class S3 {
  private readonly BUCKET = config.bucket;

  private readonly s3Client = new S3Client({
    region: config.region,
  });

  public deleteFile = async ({
    key,
  }: DeleteFileParams): Promise<{ httpStatusCode: number }> => {
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

  public getSignedUrl = async ({
    key,
  }: GetSignedUrlParams): Promise<{ signedUrl: string }> => {
    const signedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.BUCKET,
        Key: key,
      }),
      { expiresIn: 3600 }
    );

    return { signedUrl }; // when the user wants to get his profile, extract the key from the db and generate the signed url and send in the response body
  };

  public getUrl = ({ key }: GetUrlParams): { url: string } => {
    const url = `https://${this.BUCKET}.s3.${config.region}.amazonaws.com/${key}`;

    return { url };
  };

  public putFile = async ({
    acl,
    body,
    contentType,
    key,
  }: UploadFileParams): Promise<{ httpStatusCode: number; key: string }> => {
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
