# АКОМП ЮГ - Производство сгущенного молока

Веб-приложение для управления каталогом продукции АКОМП ЮГ с административной панелью.

## 🚀 Развертывание на Render

### Автоматическое развертывание (рекомендуется)

1. Создайте аккаунт на [Render](https://render.com)
2. Подключите ваш GitHub репозиторий
3. Используйте файл `render.yaml` для автоматической настройки сервисов
4. Render автоматически создаст:
   - Веб-сервис (Node.js приложение)
   - PostgreSQL базу данных

### Ручное развертывание

#### 1. Создание PostgreSQL базы данных
- В Render Dashboard создайте новый PostgreSQL сервис
- Скопируйте connection string

#### 2. Создание веб-сервиса
- Создайте новый Web Service
- Выберите Node.js runtime
- Установите Build Command: `npm ci --only=production`
- Установите Start Command: `npm start`
- Добавьте переменные окружения:
  ```
  NODE_ENV=production
  DB_HOST=<ваш_postgres_host>
  DB_PORT=<ваш_postgres_port>
  DB_NAME=<ваша_база>
  DB_USER=<ваш_пользователь>
  DB_PASSWORD=<ваш_пароль>
  ```

## 🛠 Локальная разработка

### Требования
- Node.js 18+
- Docker и Docker Compose

### Запуск
```bash
# Клонировать репозиторий
git clone <ваш-репозиторий>
cd akomp

# Установить зависимости
npm install

# Запустить с Docker
docker-compose up -d

# Или запустить локально (требуется PostgreSQL)
npm run dev
```

## 📁 Структура проекта

```
├── server.js          # Основной сервер Express
├── init.sql           # Инициализация базы данных
├── docker-compose.yml # Docker конфигурация
├── render.yaml        # Render конфигурация
├── package.json       # Зависимости
├── Dockerfile         # Docker образ
├── index.html         # Главная страница
├── products.html      # Страница каталога
├── push.html          # Админ-панель
├── CSS/               # Стили
├── javascript/        # Клиентский JavaScript
└── media/             # Медиафайлы
```

## 🔧 API Endpoints

- `GET /` - Главная страница
- `GET /products.html` - Каталог товаров
- `GET /push` - Админ-панель
- `GET /api/products` - Получить все товары
- `POST /api/products` - Добавить товар
- `PUT /api/products/:id` - Обновить товар
- `DELETE /api/products/:id` - Удалить товар

## 📊 Админ-панель

Доступна по адресу `/push` (без кнопки в меню).
Позволяет:
- Просматривать все товары
- Добавлять новые товары
- Редактировать существующие
- Удалять товары

## 🗄️ База данных

Используется PostgreSQL с таблицами:
- `products` - Товары (id, name, article, description, price, image_url, timestamps)
- `product_images` - Дополнительные изображения товаров

## 📝 Переменные окружения

См. `.env.example` для полного списка необходимых переменных.

## 📄 Лицензия

Все права защищены © АКОМП ЮГ