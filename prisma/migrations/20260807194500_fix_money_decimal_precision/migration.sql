-- Narrow money columns from DECIMAL(65,30) to a practical money precision
ALTER TABLE "bills"
ALTER COLUMN "balance" TYPE DECIMAL(19,2)
USING ROUND("balance"::numeric, 2);

ALTER TABLE "transactions"
ALTER COLUMN "amount" TYPE DECIMAL(19,2)
USING ROUND("amount"::numeric, 2);
