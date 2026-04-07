-- Создание базы данных (если не существует)
-- CREATE DATABASE akomp_db;
-- \c akomp_db;

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    article VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_products_article ON products(article);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Создание таблицы для хранения изображений товаров (опционально)
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для внешнего ключа
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at в products
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных (опционально)
INSERT INTO products (name, article, description, price) VALUES
    ('Молоко цельное сгущенное с сахаром', 'SG-001', 'М.Д.Ж. 8,5% ж/б, 380 г., крышка легко вскрываемая с кольцом', 117.00),
    ('Консервы молокосодержащие сгущённые с сахаром «Сгущёнка»', 'SG-002', 'М.Д.Ж. 8,5% ж/б, 370 г.', 83.50),
    ('Продукт молокосодержащий сгущенный «Варёная Сгущёнка»', 'SG-003', 'М.Д.Ж. 8,5% ж/б, 370 г.', 75.00)
ON CONFLICT (article) DO NOTHING;

-- Создание пользователя для приложения (если нужно)
-- CREATE USER akomp_user WITH PASSWORD 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO akomp_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO akomp_user;

-- Вывод информации о созданных таблицах
SELECT 'Database initialized successfully!' as status;