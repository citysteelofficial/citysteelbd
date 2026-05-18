-- Migration: Add specifications JSONB column to products table
-- This enables storing dynamic key-value pairs (like Material Grade, Durability) for each product.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'specifications'
    ) THEN
        ALTER TABLE products ADD COLUMN specifications JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;
