const express = require('express');
const path = require('path');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/media', express.static(path.join(__dirname, 'media')));

// PostgreSQL подключение с повторными попытками
const pool = new Pool({
    user: process.env.DB_USER || 'akomp_user',
    password: process.env.DB_PASSWORD || 'akomp_pass123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'akomp_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Настройка загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'media/products/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Функция проверки подключения к БД
async function checkDatabaseConnection(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('✅ Подключение к PostgreSQL установлено');
            return true;
        } catch (err) {
            console.log(`⏳ Ожидание подключения к БД... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    console.error('❌ Не удалось подключиться к PostgreSQL');
    return false;
}

// API: Получить все товары
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id, 
                p.name, 
                p.article, 
                p.image_url,
                p.description,
                p.price,
                p.created_at,
                p.updated_at,
                COALESCE(
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_main = true LIMIT 1),
                    p.image_url
                ) as main_image
            FROM products p 
            ORDER BY p.id
        `);
        res.json({ products: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки товаров' });
    }
});

// API: Получить один товар
app.get('/api/products/:id', async (req, res) => {
    try {
        const productResult = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [req.params.id]
        );
        
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        const imagesResult = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order, id',
            [req.params.id]
        );
        
        const product = productResult.rows[0];
        product.images = imagesResult.rows;
        
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки товара' });
    }
});

// API: Добавить товар
app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, article, description, price } = req.body;
    const image_url = req.file ? `/media/products/${req.file.filename}` : null;
    
    if (!name || !article || !description) {
        return res.status(400).json({ error: 'Название, артикул и полное название обязательны' });
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO products (name, article, image_url, description, price) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, article, image_url, description || null, price || null]
        );
        res.json({ success: true, product: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: 'Товар с таким артикулом уже существует' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Ошибка добавления товара' });
        }
    }
});

// API: Обновить товар
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const { name, article, description, price } = req.body;
    const id = req.params.id;
    let image_url = req.file ? `/media/products/${req.file.filename}` : null;
    
    if (!name || !article || !description) {
        return res.status(400).json({ error: 'Название, артикул и полное название обязательны' });
    }
    
    try {
        let query;
        let params;
        
        if (image_url) {
            query = `UPDATE products 
                     SET name = $1, article = $2, image_url = $3, 
                         description = $4, price = $5, updated_at = CURRENT_TIMESTAMP 
                     WHERE id = $6 
                     RETURNING *`;
            params = [name, article, image_url, description || null, price || null, id];
        } else {
            query = `UPDATE products 
                     SET name = $1, article = $2, 
                         description = $3, price = $4, updated_at = CURRENT_TIMESTAMP 
                     WHERE id = $5 
                     RETURNING *`;
            params = [name, article, description || null, price || null, id];
        }
        
        const result = await pool.query(query, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json({ success: true, product: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: 'Товар с таким артикулом уже существует' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Ошибка обновления товара' });
        }
    }
});

// API: Удалить товар
app.delete('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json({ success: true, product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
});

// API: Поиск товаров
app.get('/api/products/search/:query', async (req, res) => {
    const searchQuery = `%${req.params.query}%`;
    try {
        const result = await pool.query(
            `SELECT * FROM products 
             WHERE name ILIKE $1 OR article ILIKE $1 
             ORDER BY name`,
            [searchQuery]
        );
        res.json({ products: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка поиска' });
    }
});

// API: Статистика
app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_products,
                COUNT(DISTINCT article) as unique_articles
            FROM products
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения статистики' });
    }
});

// Страница добавления товаров (/push)
app.get('/push', (req, res) => {
    res.sendFile(path.join(__dirname, 'push.html'));
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check для Docker
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Запуск сервера
async function startServer() {
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected) {
        console.error('❌ Не удалось запустить сервер без подключения к БД');
        process.exit(1);
    }
    
    app.listen(PORT, '0.0.0.0', () => {
        const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
        console.log(`\n🚀 Сервер запущен на http://${host}:${PORT}`);
        console.log(`📦 Админ-панель: http://${host}:${PORT}/push`);
        console.log(`📊 API товаров: http://${host}:${PORT}/api/products`);
        console.log(`💚 Health check: http://localhost:${PORT}/health`);
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`\n🐘 pgAdmin: http://localhost:5050`);
            console.log(`   Email: ${process.env.PGADMIN_EMAIL || 'admin@akomp.ru'}`);
            console.log(`   Password: ${process.env.PGADMIN_PASSWORD || 'admin123'}`);
        }
        console.log('');
    });
}

startServer();