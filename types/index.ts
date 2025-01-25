import { Request, Router } from "express";

/**
 * Extended Express Request interface to pass Payload Object to the request. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userData:string
 */
export type AuthRequest = Request<unknown, unknown, Payload>;

export type IResource = "gallery" | "identity" | "profile";

export interface IRoute {
  path: string;
  router: Router;
}

/**
 * Payload Object to be signed and verified by JWT. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userData:string
 */
export interface Payload {
  userData: string;
}
