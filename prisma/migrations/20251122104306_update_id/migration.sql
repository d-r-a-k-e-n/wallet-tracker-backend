/*
  Warnings:

  - The primary key for the `bills` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sub_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `transactions` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bills" DROP CONSTRAINT "bills_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sub_category_id_fkey";

-- AlterTable
ALTER TABLE "bills" DROP CONSTRAINT "bills_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bills_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bills_id_seq";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sub_categories_id_seq";

-- AlterTable
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sub_category_id" SET DATA TYPE TEXT,
ALTER COLUMN "bill_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "transactions_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
