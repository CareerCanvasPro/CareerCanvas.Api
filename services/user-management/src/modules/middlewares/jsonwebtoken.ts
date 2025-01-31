import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { config } from "../../config";

interface IAccessTokenPayload {
  email: string;
  userID: string;
}

export function handleVerifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { authorization } = req.headers;
  console.log("AUTHORIZATION HEADER: ", authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      data: null,
      message: "Access token is missing",
    });
  } else {
    const accessToken = authorization.split(" ")[1];
    console.log("ACCESS TOKEN: ", accessToken);
    console.log("CLIENT SECRET: ", config.aws.clientSecret);
    try {
      const decoded = verify(
        accessToken,
        config.aws.clientSecret
      ) as IAccessTokenPayload;
      console.log("USER ID: ", decoded.userID);
      req.body = { ...req.body, ...decoded };

      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({
          data: null,
          message: `${error.name}: Invalid access token`,
        });
      } else if (error.name === "TokenExpiredError") {
        res.status(401).json({
          data: null,
          message: `${error.name}: Access token has expired`,
        });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  }
}
