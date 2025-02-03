import { Request, Response } from "express";

export function handleNotFound(req: Request, res: Response): void {
  res
    .status(404)
    .render("error", { message: "404 Not Found", title: "404 Not Found" });
}
