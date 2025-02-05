import { Request, Response } from "express";

import { S3 } from "../services";

export class MediaController {
  public async handleRemoveCertificate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const { certificate } = req.query;

      const { httpStatusCode } = await s3.deleteFile({
        key: certificate as string,
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
  }

  public async handleRemoveProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const { profilePicture } = req.query;

      const { httpStatusCode } = await s3.deleteFile({
        key: profilePicture as string,
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
  }

  public async handleRetrieveCertificate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const { certificate } = req.body;

      const { signedUrl } = await s3.getSignedUrl({
        key: certificate,
      });

      res.status(200).json({
        data: { signedUrl },
        message: "Certificate retrieved successfully",
      });
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
  }

  public async handleRetrieveProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const { profilePicture } = req.body;

      const { url } = s3.getUrl({
        key: profilePicture,
      });

      res.status(200).json({
        data: { url },
        message: "Profile picture retrieved successfully",
      });
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
  }

  public async handleUploadCertificate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const {
        body: { error, index, userID },
        file,
      } = req;

      if (error) {
        res.status(400).json(error);
      } else if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype } = file;

        const { httpStatusCode, key } = await s3.putFile({
          acl: "public-read",
          body: buffer,
          contentType: mimetype,
          key: `${userID}-certificate-${index}`,
        });

        const { url } = s3.getUrl({ key });

        res.status(httpStatusCode).json({
          data: { url },
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
  }

  public async handleUploadProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const s3 = new S3();

      const {
        body: { error, userID },
        file,
      } = req;

      if (error) {
        res.status(400).json(error);
      } else if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype } = file;

        const { httpStatusCode, key } = await s3.putFile({
          acl: "public-read",
          body: buffer,
          contentType: mimetype,
          key: `${userID}-profile-picture`,
        });

        const { url } = s3.getUrl({ key });

        res.status(httpStatusCode).json({
          data: { url },
          message: "Profile picture uploaded successfully",
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
  }

  // public async getPresignedImageUrls(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   try {
  //     const data = await this.s3.getPresignedUrls(req.body.imageGallery);

  //     if (data.length === 0) {
  //       res.status(404).json({
  //         data: null,
  //         message: "No presigned URLs found for the specified image gallery",
  //       });
  //     } else {
  //       res
  //         .status(200)
  //         .json({ data, message: "Presigned URLs retrieved successfully" });
  //     }
  //   } catch (error) {
  //     if (error.$metadata && error.$metadata.httpStatusCode) {
  //       res
  //         .status(error.$metadata.httpStatusCode)
  //         .json({ data: null, message: error.message });
  //     } else {
  //       res.status(500).json({ data: null, message: error.message });
  //     }
  //   }
  // }
}
