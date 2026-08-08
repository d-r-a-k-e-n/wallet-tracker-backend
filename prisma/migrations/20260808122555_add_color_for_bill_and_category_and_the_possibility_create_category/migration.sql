-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#32CD32';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#0085B2',
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "sub_categories" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
