import { Router } from "express";

export interface IRoute {
  path: string;
  router: Router;
}

export interface ApiResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
    [key: string]: string | boolean;
  };
  body: string;
}
