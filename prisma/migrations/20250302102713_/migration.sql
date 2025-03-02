-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "expiresAt" BIGINT NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);
