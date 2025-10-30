-- ====== EXTENSIONS ======
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====== DROP OLD TABLES IF EXIST ======
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP VIEW IF EXISTS product_attributes CASCADE;
DROP TYPE IF EXISTS category_enum CASCADE;
DROP TYPE IF EXISTS sleeve_enum CASCADE;
DROP TYPE IF EXISTS style_enum CASCADE;
DROP TYPE IF EXISTS size_enum CASCADE;

-- ====== TABLES ======
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    gender TEXT,
    master_category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    article_type TEXT NOT NULL,
    base_colour TEXT,
    season TEXT,
    year NUMERIC,
    usage TEXT,
    product_display_name TEXT NOT NULL,
    image_url TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====== INDEXES ======
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_master_category ON products(master_category);
CREATE INDEX idx_products_sub_category ON products(sub_category);
CREATE INDEX idx_products_article_type ON products(article_type);
CREATE INDEX idx_products_base_colour ON products(base_colour);
CREATE INDEX idx_products_season ON products(season);
CREATE INDEX idx_products_usage ON products(usage);
CREATE INDEX idx_products_price ON products(price);

-- ====== LOAD DATA FROM CSV ======
COPY products(id, gender, master_category, sub_category, article_type, base_colour, season, year, usage, product_display_name, image_url)
FROM '/docker-entrypoint-initdb.d/products.csv'
DELIMITER ','
CSV HEADER;

-- ====== GENERATE RANDOM PRICES AND STOCK ======
UPDATE products
SET 
    price = CASE 
        WHEN master_category = 'Apparel' THEN 
            CASE 
                WHEN article_type ILIKE '%Jacket%' THEN round((69 + random()*80)::numeric, 2)
                WHEN article_type ILIKE '%Shirt%' THEN round((14 + random()*20)::numeric, 2)
                WHEN article_type ILIKE '%Jeans%' OR article_type ILIKE '%Trousers%' THEN round((39 + random()*40)::numeric, 2)
                WHEN article_type ILIKE '%Tshirt%' OR article_type ILIKE '%Tops%' THEN round((12 + random()*18)::numeric, 2)
                WHEN article_type ILIKE '%Kurta%' THEN round((25 + random()*35)::numeric, 2)
                WHEN article_type ILIKE '%Dress%' THEN round((35 + random()*50)::numeric, 2)
                ELSE round((20 + random()*30)::numeric, 2)
            END
        WHEN master_category = 'Footwear' THEN 
            CASE 
                WHEN article_type ILIKE '%Sports%' THEN round((59 + random()*70)::numeric, 2)
                WHEN article_type ILIKE '%Formal%' THEN round((69 + random()*80)::numeric, 2)
                WHEN article_type ILIKE '%Casual%' THEN round((45 + random()*55)::numeric, 2)
                WHEN article_type ILIKE '%Flip Flop%' THEN round((8 + random()*12)::numeric, 2)
                WHEN article_type ILIKE '%Sandal%' THEN round((20 + random()*30)::numeric, 2)
                ELSE round((40 + random()*50)::numeric, 2)
            END
        WHEN master_category = 'Accessories' THEN 
            CASE 
                WHEN article_type ILIKE '%Watch%' THEN round((89 + random()*200)::numeric, 2)
                WHEN article_type ILIKE '%Bag%' OR article_type ILIKE '%Backpack%' THEN round((35 + random()*65)::numeric, 2)
                WHEN article_type ILIKE '%Wallet%' THEN round((18 + random()*32)::numeric, 2)
                WHEN article_type ILIKE '%Belt%' THEN round((15 + random()*25)::numeric, 2)
                WHEN article_type ILIKE '%Sunglass%' THEN round((25 + random()*75)::numeric, 2)
                WHEN article_type ILIKE '%Jewellery%' OR article_type ILIKE '%Earring%' OR article_type ILIKE '%Ring%' OR article_type ILIKE '%Bracelet%' THEN round((12 + random()*38)::numeric, 2)
                ELSE round((10 + random()*20)::numeric, 2)
            END
        WHEN master_category = 'Personal Care' THEN round((5 + random()*15)::numeric, 2)
        WHEN master_category = 'Free Items' THEN 0.00
        ELSE round((15 + random()*35)::numeric, 2)
    END,
    stock = (5 + floor(random()*50))::int
WHERE price = 0.00;

-- ====== CREATE VIEW FOR DISTINCT VALUES ======
CREATE VIEW product_attributes AS
SELECT 
    ARRAY_AGG(DISTINCT gender ORDER BY gender) FILTER (WHERE gender IS NOT NULL) as genders,
    ARRAY_AGG(DISTINCT master_category ORDER BY master_category) as master_categories,
    ARRAY_AGG(DISTINCT sub_category ORDER BY sub_category) as sub_categories,
    ARRAY_AGG(DISTINCT article_type ORDER BY article_type) as article_types,
    ARRAY_AGG(DISTINCT base_colour ORDER BY base_colour) FILTER (WHERE base_colour IS NOT NULL) as colours,
    ARRAY_AGG(DISTINCT season ORDER BY season) FILTER (WHERE season IS NOT NULL) as seasons,
    ARRAY_AGG(DISTINCT usage ORDER BY usage) FILTER (WHERE usage IS NOT NULL) as usages
FROM products;