-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_enum') THEN
        CREATE TYPE category_enum AS ENUM ('hoodies','shirts','jeans','jackets','pants');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sleeve_enum') THEN
        CREATE TYPE sleeve_enum AS ENUM ('long','short','sleeveless');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'style_enum') THEN
        CREATE TYPE style_enum AS ENUM ('plain','printed','embroidered');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'size_enum') THEN
        CREATE TYPE size_enum AS ENUM ('XS','S','M','L','XL','XXL');
    END IF;
END$$;

-- Tables
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'public',
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category category_enum NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    sleeve sleeve_enum,
    style style_enum,
    size size_enum NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed only if empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products) THEN
        INSERT INTO products (slug, name, category, description) VALUES
        ('plain-blue-hoodie','Plain Blue Hoodie','hoodies','Soft cotton hoodie, regular fit.'),
        ('plain-black-hoodie','Plain Black Hoodie','hoodies','Everyday black hoodie.'),
        ('printed-red-hoodie','Printed Red Hoodie','hoodies','Graphic red hoodie.'),
        ('plain-white-shirt','Plain White Shirt','shirts','Classic white t-shirt.'),
        ('printed-black-shirt','Printed Black Shirt','shirts','Black t-shirt with front graphic.'),
        ('classic-blue-jeans','Classic Blue Jeans','jeans','Slim fit blue jeans.'),
        ('black-stretch-jeans','Black Stretch Jeans','jeans','Stretchy black jeans.');

        INSERT INTO product_variants (product_id, sku, color, sleeve, style, size, price, stock, image_url)
        SELECT p.id, v.sku, v.color, v.sleeve, v.style, v.size, v.price, v.stock, v.image_url
        FROM products p
        JOIN (
            VALUES
            -- Hoodies
            ('plain-blue-hoodie','HOD-BLU-LONG-PLN-M','blue','long'::sleeve_enum,'plain'::style_enum,'M'::size_enum,59.00,12,'https://picsum.photos/seed/hodblu1/600'),
            ('plain-black-hoodie','HOD-BLK-LONG-PLN-L','black','long'::sleeve_enum,'plain'::style_enum,'L'::size_enum,65.00,8,'https://picsum.photos/seed/hodblk1/600'),
            ('printed-red-hoodie','HOD-RED-LONG-PRT-M','red','long'::sleeve_enum,'printed'::style_enum,'M'::size_enum,69.00,6,'https://picsum.photos/seed/hodred1/600'),
            -- Shirts
            ('plain-white-shirt','SRT-WHT-SHORT-PLN-M','white','short'::sleeve_enum,'plain'::style_enum,'M'::size_enum,19.90,25,'https://picsum.photos/seed/srtwht1/600'),
            ('printed-black-shirt','SRT-BLK-SHORT-PRT-M','black','short'::sleeve_enum,'printed'::style_enum,'M'::size_enum,24.90,14,'https://picsum.photos/seed/srtblk1/600'),
            -- Jeans (sin sleeve)
            ('classic-blue-jeans','JNS-BLU-PLN-32','blue',NULL::sleeve_enum,'plain'::style_enum,'M'::size_enum,49.90,20,'https://picsum.photos/seed/jnsblu/600'),
            ('black-stretch-jeans','JNS-BLK-PLN-32','black',NULL::sleeve_enum,'plain'::style_enum,'M'::size_enum,54.90,15,'https://picsum.photos/seed/jnsblk/600')
        ) AS v(slug,sku,color,sleeve,style,size,price,stock,image_url)
        ON p.slug = v.slug;
    END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_color ON product_variants(color);
CREATE INDEX IF NOT EXISTS idx_variants_price ON product_variants(price);
