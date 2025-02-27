import { Client } from "pg";

export const client = new Client({
  user: "career_canvas",
  host: "localhost",
  database: "career_canvas",
  password: "Cloud2025$",
  port: 5432,
});
