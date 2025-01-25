import { unlink } from "fs";
import { extname } from "path";

import { Axios } from "@career-canvas/services/axios";
import { Request, Response } from "express";

// import sharp from "sharp";

import { config } from "../../config";
import { S3 } from "../services";

export class MediaController {
  private readonly axios = new Axios(config.service.userManagement);
  private readonly s3 = new S3();

  public async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const accessToken = req.headers.authorization;

      const { localPath, username } = req.body;

      if (!localPath) {
        res.status(400).json({ data: null, message: "No file uploaded" });
        return;
      }

      const timestamp = new Date().getTime();

      const extension = extname(localPath).toLowerCase();

      const bucketPath = `${username}/${timestamp}${extension}`;

      // Upload original file to S3
      const { $metadata: metaData } = await this.s3.uploadImage(
        bucketPath,
        localPath
      );

      // Clean up the temporary file
      unlink(localPath, (error) => {
        throw error;
      });

      // Update gallery with the new image
      const data = {
        metaData,
        status: "pending",
      };

      this.axios
        .updateItem(accessToken, "gallery", data)
        .then((data) =>
          res
            .status(200)
            .json({ data, message: "Image uploaded and profile updated" })
        )
        .catch((error) =>
          res
            .status(200)
            .json({ data, message: "Image uploaded but profile not updated" })
        );
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  }

  public async getPresignedImageUrls(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data = await this.s3.getPresignedUrls(req.body.imageGallery);

      if (data.length === 0) {
        res.status(404).json({
          data: null,
          message: "No presigned URLs found for the specified image gallery",
        });
      } else {
        res
          .status(200)
          .json({ data, message: "Presigned URLs retrieved successfully" });
      }
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: error.message });
      } else {
        res.status(500).json({ data: null, message: error.message });
      }
    }
  }
}
