import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export const s3Client = new S3Client({ region: process.env.REGION });
