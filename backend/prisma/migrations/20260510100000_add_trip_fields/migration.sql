-- AlterTable: add destination and budget columns to trips
ALTER TABLE "trips" ADD COLUMN "destination" TEXT;
ALTER TABLE "trips" ADD COLUMN "budget" DOUBLE PRECISION;
