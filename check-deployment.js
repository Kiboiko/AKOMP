#!/usr/bin/env node

/**
 * Скрипт проверки развертывания АКОМП ЮГ
 */

const https = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🔍 Проверка развертывания АКОМП ЮГ');
console.log('==================================');

// Проверка переменных окружения
console.log('\n📋 Переменные окружения:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'не установлена'}`);
console.log(`PORT: ${process.env.PORT || 'не установлена'}`);
console.log(`DB_HOST: ${process.env.DB_HOST ? 'установлена' : 'не установлена'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 'не установлена'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'не установлена'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'не установлена'}`);

// Функция для проверки URL
function checkUrl(url, description) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ ${description}`);
                resolve(true);
            } else {
                console.log(`❌ ${description} (статус: ${res.statusCode})`);
                resolve(false);
            }
        });

        req.on('error', () => {
            console.log(`❌ ${description} (ошибка подключения)`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log(`❌ ${description} (таймаут)`);
            resolve(false);
        });
    });
}

async function runChecks() {
    // Проверка health endpoint
    console.log('\n💚 Проверка health check...');
    await checkUrl(`${BASE_URL}/health`, 'Health check прошел успешно');

    // Проверка главной страницы
    console.log('\n🏠 Проверка главной страницы...');
    await checkUrl(`${BASE_URL}/`, 'Главная страница загружается');

    // Проверка API товаров
    console.log('\n📊 Проверка API товаров...');
    await checkUrl(`${BASE_URL}/api/products`, 'API товаров работает');

    // Проверка админ-панели
    console.log('\n📦 Проверка админ-панели...');
    await checkUrl(`${BASE_URL}/push`, 'Админ-панель доступна');

    console.log('\n🎉 Проверка завершена!');
}

runChecks().catch(console.error);