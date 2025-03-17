/*
  Warnings:

  - A unique constraint covering the columns `[otp,username]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Otp_otp_username_key" ON "Otp"("otp", "username");
