ALTER TABLE "products"
  ALTER COLUMN "price" TYPE DECIMAL(10, 2)
  USING ROUND("price"::numeric, 2);

ALTER TABLE "orders"
  ALTER COLUMN "total" TYPE DECIMAL(10, 2)
  USING ROUND("total"::numeric, 2);

ALTER TABLE "order_items"
  ALTER COLUMN "price" TYPE DECIMAL(10, 2)
  USING ROUND("price"::numeric, 2);
