import { Router } from "express";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface IRoute {
  path: string;
  router: Router;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  password: string;
  name: string;
  title?: string;
  institution?: string;
  location?: string;
  about?: string;
  profileImage?: string;
}

export interface Session {
  id: string;
  userId: string;
  expires: number;
}

export interface LambdaHandler {
  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
}

export interface OTP {
  id: string;
  code: string;
  phoneNumber: string;
  expires: number;
  verified: boolean;
}

export interface MagicLink {
  id: string;
  token: string;
  email: string;
  expires: number;
  used: boolean;
}

export type AuthMethod = 'email' | 'phone' | 'whatsapp';