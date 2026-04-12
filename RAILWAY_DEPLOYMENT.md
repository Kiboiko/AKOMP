# Railway Deployment Guide

Railway - это простая платформа для деплоя приложений с PostgreSQL базой данных.

## 🚀 Быстрый старт (5 минут)

### 1. Установка Railway CLI

```bash
# Windows (PowerShell)
iwr -useb cli.new | iex

# macOS/Linux
curl -fsSL cli.new | sh
```

### 2. Login в Railway

```bash
railway login
```

Откроется браузер для аутентификации.

### 3. Инициализация проекта

```bash
cd /path/to/AKOMP
railway init
```

Выберите:
- Имя проекта: `AKOMP YUG`
- Регион: `us-west` (или ближайший к вам)

### 4. Добавление PostgreSQL

```bash
railway service add postgres
```

Railway автоматически создаст БД и установит переменные окружения.

### 5. Деплой приложения

```bash
railway up
```

Приложение начнет деплой на Railway!

## 📊 Что происходит во время деплоя

1. **Загрузка кода** (~10 сек)
   - Git клонируется на Railway сервер

2. **Сборка Docker** (~30 сек)
   - Собирается Docker образ из Dockerfile
   - Устанавливаются npm зависимости

3. **Запуск приложения** (~10 сек)
   - Стартует Node.js сервер
   - Инициализируется PostgreSQL БД

4. **Готово!** ✅
   - Приложение доступно по URL

## 🔗 Доступ к приложению

После деплоя Railway выдаст URL вашего приложения:

```
https://your-app.railway.app
```

Дополнительные адреса:
- Главная: `https://your-app.railway.app/`
- Админ-панель: `https://your-app.railway.app/push`
- API товаров: `https://your-app.railway.app/api/products`
- Health check: `https://your-app.railway.app/health`

## 🛠️ Команды Railway

```bash
# Просмотр логов
railway logs

# Просмотр логов specific сервиса
railway logs -s app

# Информация о проекте и сервисах
railway status

# Подключение к БД через psql
railway connect postgres

# Переменные окружения
railway variables

# Перезапуск приложения
railway redeploy

# Просмотр всех проектов
railway projects

# Переключение на другой проект
railway switch
```

## 📈 Масштабирование и настройка

### Настройка через Dashboard

1. Зайдите на [railway.app](https://railway.app)
2. Выберите ваш проект
3. Кликните на сервис (app или postgres)
4. Настройте:
   - **Replicas** - количество инстансов
   - **Memory** - оперативная память
   - **CPU** - процессорное время
   - **Environment** - переменные окружения

### План по умолчанию

Railway дает бесплатные credits:
- $5 в месяц для новых пользователей
- Обычно достаточно для малых приложений

## 🔐 Безопасность

### Переменные окружения

Railway автоматически установит:
- `DATABASE_URL` - строка для подключения к БД
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

Ваше приложение их уже обрабатывает!

### Доступ к БД

БД доступна только из вашего приложения на Railway. Локально подключиться можно через:

```bash
railway connect postgres
```

## 📊 Мониторинг

В Railway Dashboard видны:
- **Metrics** - CPU, Memory, Network
- **Logs** - все логи приложения
- **Events** - история деплоев
- **Deployments** - все версии

## 🔄 Continuous Deployment

Если хотите автоматический деплой при push на GitHub:

1. Подключите GitHub в Railway Dashboard
2. Выберите ветку для деплоя
3. Railway будет автоматически деплоить при каждом push

## ❌ Troubleshooting

### Приложение падает при старте

```bash
# Смотрим логи
railway logs -s app

# Проверяем переменные окружения
railway variables

# Проверяем, что БД работает
railway connect postgres
```

### БД не подключается

```bash
# Проверяем статус PostgreSQL
railway status

# Смотрим логи БД
railway logs -s postgres

# Информация о БД
railway variables | grep DATABASE
```

### Нет доступа к приложению

1. Проверьте, что приложение запущено: `railway status`
2. Проверьте логи: `railway logs -s app`
3. Проверьте URL в Railway Dashboard

## 💡 Советы

1. **Локальное тестирование:**
   ```bash
   npm start
   docker-compose up -d
   ```

2. **Перед деплоем:**
   - Тестируйте локально
   - Проверьте зависимости в package.json
   - Убедитесь что package-lock.json в репозитории

3. **После деплоя:**
   - Проверьте `https://your-app.railway.app/health`
   - Проверьте логи первых 5 минут
   - Тестируйте основные функции

## 📚 Полезные ссылки

- [Railway Docs](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/reference/cli-api)
- [Troubleshooting Guide](https://docs.railway.app/troubleshoot/common-issues)
- [Pricing](https://railway.app/pricing)

## 🆘 Если что-то не работает

1. Смотрите логи: `railway logs`
2. Проверяйте переменные: `railway variables`
3. Читайте [Railway docs](https://docs.railway.app)
4. Создавайте issue на GitHub