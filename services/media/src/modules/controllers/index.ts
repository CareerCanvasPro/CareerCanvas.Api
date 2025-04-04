import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { config } from "../../config";
import { Axios, S3 } from "../services";

export class MediaController {
  private readonly axios = new Axios();

  private readonly s3 = new S3();

  public handleRemoveCertificate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { key } = req.query;

      const { httpStatusCode } = await this.s3.deleteFile({
        key: key as string,
      });

      if (httpStatusCode === 204) {
        res.status(200).json({
          data: null,
          message: "Certificate removed successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleRemoveProfilePicture = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const { httpStatusCode } = await this.s3.deleteFile({
        key: `${userId}-profile-picture`,
      });

      if (httpStatusCode === 204) {
        res.status(200).json({
          data: null,
          message: "Profile picture removed successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleRemoveResume = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { key } = req.query;

      const { httpStatusCode } = await this.s3.deleteFile({
        key: key as string,
      });

      if (httpStatusCode === 204) {
        res.status(200).json({
          data: null,
          message: "Resume removed successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleRetrieveSignedUrl = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { key } = req.query;

      const { signedUrl } = await this.s3.getSignedUrl({ key: key as string });

      res.status(200).json({
        data: { signedUrl },
        message: "Signed URL retrieved successfully",
      });
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: error.message });
      } else {
        res.status(500).json({ data: null, message: error.message });
      }
    }
  };

  public handleUploadCertificate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { error, userId },
        file,
      } = req;

      if (error) {
        res.status(400).json(error);
      } else if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype, originalname, size } = file;

        const { httpStatusCode, key } = await this.s3.putFile({
          acl: "private",
          body: buffer,
          contentType: mimetype,
          key: `${userId}-certificate-${Date.now()}`,
        });

        res.status(httpStatusCode).json({
          data: {
            file: {
              key,
              name: originalname,
              size,
              type: mimetype,
            },
          },
          message: "Certificate uploaded successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleUploadImage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { error },
        file,
      } = req;

      if (error) {
        res.status(400).json(error);
      } else if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype } = file;

        const { httpStatusCode, key } = await this.s3.putFile({
          acl: "public-read",
          body: buffer,
          contentType: mimetype,
          key: uuidv4(),
        });

        const { url } = this.s3.getUrl({ key });

        res.status(httpStatusCode).json({
          data: { url },
          message: "Image uploaded successfully",
        });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };

  public handleUploadResume = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { authorization, error, userId },
        file,
      } = req;

      if (error) {
        res.status(400).json(error);
      } else if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype, originalname, size } = file;

        const { key } = await this.s3.putFile({
          acl: "private",
          body: buffer,
          contentType: mimetype,
          key: `${userId}-resume-${Date.now()}`,
        });

        const { data, status } = await this.axios.post({
          authorization,
          data: {
            resume: {
              key,
              name: originalname,
              size,
              type: mimetype,
            },
          },
          url: `${config.baseUrl.users}/user/resumes`,
        });

        res.status(status).json(data);
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };
}
