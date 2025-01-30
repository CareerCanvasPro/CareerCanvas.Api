import { Request, Response } from "express";

import { DB } from "../../../../../utility/db";
import { S3 } from "../services";

export class MediaController {
  private readonly s3 = new S3();

  public async handleRemoveProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const db = new DB();

      const { userID } = req.body;

      await this.s3.deleteFile({
        key: userID,
      });

      const { httpStatusCode } = await db.removeAttribute({
        attributeName: "profilePicture",
        key: { name: "userID", value: userID },
        tableName: "userprofiles",
      });

      res.status(httpStatusCode).json({
        data: null,
        message: "Profile picture removed successfully",
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

  public async handleUpdateProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        body: { userID },
        file,
      } = req;

      if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype } = file;

        const { httpStatusCode, key } = await this.s3.putFile({
          body: buffer,
          contentType: mimetype,
          key: userID,
        });

        res.status(httpStatusCode).json({
          data: { key },
          message: "Profile picture updated successfully",
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
      const db = new DB();

      const {
        body: { userID },
        file,
      } = req;

      if (!file) {
        res.status(400).json({ data: null, message: "No file uploaded" });
      } else {
        const { buffer, mimetype } = file;

        const { key } = await this.s3.putFile({
          body: buffer,
          contentType: mimetype,
          key: userID,
        });

        const { httpStatusCode } = await db.updateItem({
          attribute: { name: "profilePicture", value: key },
          key: { name: "userID", value: userID },
          tableName: "userprofiles",
        });

        res.status(httpStatusCode).json({
          data: { key },
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
