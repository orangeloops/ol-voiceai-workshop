-- ====== PRE: extensiones y tipos (igual que los tuyos) ======
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- ====== Tablas (igual que las tuyas) ======
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

-- ====== SEED MASIVO: 1000 productos + 1 variante c/u ======
DO $$
DECLARE
    TARGET_COUNT INTEGER := 1000;
    i INTEGER;
    cat category_enum;
    col TEXT;
    slv sleeve_enum;
    sty style_enum;
    sz size_enum;
    product_id UUID;
    product_name TEXT;
    product_slug TEXT;
    product_desc TEXT;
    cat_code TEXT;
    price_val NUMERIC;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
        FOR i IN 1..TARGET_COUNT LOOP
            -- Elegir categoría aleatoriamente
            cat := (ARRAY['hoodies','shirts','jeans','jackets','pants']::category_enum[])[1 + floor(random()*5)::int];
            
            -- Elegir color según categoría
            col := CASE cat
                WHEN 'hoodies' THEN (ARRAY['black','blue','gray','red','green','white','beige'])[1 + floor(random()*7)::int]
                WHEN 'shirts' THEN (ARRAY['white','black','navy','gray','red','green','yellow','beige'])[1 + floor(random()*8)::int]
                WHEN 'jeans' THEN (ARRAY['blue','black','darkblue','lightblue','gray'])[1 + floor(random()*5)::int]
                WHEN 'jackets' THEN (ARRAY['black','navy','olive','brown','beige','gray'])[1 + floor(random()*6)::int]
                WHEN 'pants' THEN (ARRAY['black','navy','khaki','gray','brown','olive'])[1 + floor(random()*6)::int]
            END;
            
            -- Elegir estilo
            sty := CASE cat
                WHEN 'hoodies' THEN (ARRAY['plain','printed','embroidered']::style_enum[])[1 + floor(random()*3)::int]
                WHEN 'shirts' THEN (ARRAY['plain','printed','embroidered']::style_enum[])[1 + floor(random()*3)::int]
                WHEN 'jackets' THEN (ARRAY['plain','embroidered']::style_enum[])[1 + floor(random()*2)::int]
                ELSE 'plain'::style_enum
            END;
            
            -- Elegir sleeve (solo para tops)
            slv := CASE cat
                WHEN 'hoodies' THEN (ARRAY['long','short']::sleeve_enum[])[1 + floor(random()*2)::int]
                WHEN 'shirts' THEN (ARRAY['long','short']::sleeve_enum[])[1 + floor(random()*2)::int]
                WHEN 'jackets' THEN 'long'::sleeve_enum
                ELSE NULL
            END;
            
            -- Elegir tamaño
            sz := (ARRAY['XS','S','M','L','XL','XXL']::size_enum[])[1 + floor(random()*6)::int];
            
            -- Generar nombre
            product_name := initcap(
                CASE cat
                    WHEN 'hoodies' THEN sty::text || ' ' || col || ' Hoodie'
                    WHEN 'shirts' THEN sty::text || ' ' || col || ' T-Shirt'
                    WHEN 'jeans' THEN col || ' Jeans'
                    WHEN 'jackets' THEN sty::text || ' ' || col || ' Jacket'
                    WHEN 'pants' THEN col || ' Pants'
                END
            ) || ' #' || i;
            
            -- Generar slug único
            product_slug := regexp_replace(lower(
                CASE cat
                    WHEN 'hoodies' THEN sty::text || '-' || col || '-hoodie'
                    WHEN 'shirts' THEN sty::text || '-' || col || '-shirt'
                    WHEN 'jeans' THEN col || '-jeans'
                    WHEN 'jackets' THEN sty::text || '-' || col || '-jacket'
                    WHEN 'pants' THEN col || '-pants'
                END
            ), '[^a-z0-9\-]+', '-', 'g') || '-' || i;
            
            -- Descripción
            product_desc := CASE cat
                WHEN 'hoodies' THEN 'Soft cotton hoodie, regular fit.'
                WHEN 'shirts' THEN 'Classic t-shirt, breathable fabric.'
                WHEN 'jeans' THEN 'Denim jeans with comfortable fit.'
                WHEN 'jackets' THEN 'Versatile jacket for everyday wear.'
                WHEN 'pants' THEN 'Comfortable pants suitable for daily use.'
            END;
            
            -- Código de categoría
            cat_code := CASE cat
                WHEN 'hoodies' THEN 'HOD'
                WHEN 'shirts' THEN 'SRT'
                WHEN 'jeans' THEN 'JNS'
                WHEN 'jackets' THEN 'JKT'
                WHEN 'pants' THEN 'PNT'
            END;
            
            -- Precio base
            price_val := CASE cat
                WHEN 'hoodies' THEN round((49 + random()*30)::numeric, 2)
                WHEN 'shirts' THEN round((14 + random()*20)::numeric, 2)
                WHEN 'jeans' THEN round((39 + random()*40)::numeric, 2)
                WHEN 'jackets' THEN round((69 + random()*80)::numeric, 2)
                WHEN 'pants' THEN round((29 + random()*35)::numeric, 2)
            END;
            
            -- Ajustes de precio
            price_val := round((price_val 
                + CASE sz WHEN 'XL' THEN 3 WHEN 'XXL' THEN 5 ELSE 0 END
                + CASE sty WHEN 'embroidered' THEN 7 WHEN 'printed' THEN 3 ELSE 0 END
            )::numeric, 2);
            
            -- Insertar producto
            INSERT INTO products (slug, name, category, description)
            VALUES (product_slug, product_name, cat, product_desc)
            RETURNING id INTO product_id;
            
            -- Insertar variante
            INSERT INTO product_variants (product_id, sku, color, sleeve, style, size, price, stock, image_url)
            VALUES (
                product_id,
                cat_code || '-' || upper(substr(col,1,3)) || '-' ||
                COALESCE(CASE slv WHEN 'long' THEN 'LNG' WHEN 'short' THEN 'SRT' ELSE NULL END, 'NOS') || '-' ||
                CASE sty WHEN 'plain' THEN 'PLN' WHEN 'printed' THEN 'PRT' WHEN 'embroidered' THEN 'EMB' END || '-' ||
                sz::text || '-' || lpad(i::text, 4, '0'),
                col,
                slv,
                sty,
                sz,
                price_val,
                (5 + floor(random()*30))::int,
                'https://picsum.photos/seed/' || cat::text || '-' || col || '-' || i::text || '/600/600'
            );
        END LOOP;
    END IF;
END$$;

-- ====== Indexes útiles ======
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_color ON product_variants(color);
CREATE INDEX IF NOT EXISTS idx_variants_price ON product_variants(price);