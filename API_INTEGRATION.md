# API Integration Guide

## Обзор

Этот проект интегрирован с Laravel бэкендом через REST API. Все API вызовы централизованы в `lib/api.ts` и используют типизированные интерфейсы из `lib/types.ts`.

## Структура API

### Базовый URL
```
http://localhost:8000/api
```

### Аутентификация
- **Тип**: Bearer Token (Laravel Sanctum)
- **Хранение**: localStorage
- **Автоматическое обновление**: Да

## Основные эндпоинты

### Аутентификация

#### Регистрация
```typescript
POST /register
{
  "name": "string",
  "phone": "string (9 digits)",
  "password": "string (min 6)",
  "password_confirmation": "string"
}
```

#### Вход
```typescript
POST /login
{
  "phone": "string (9 digits)",
  "password": "string"
}

Response:
{
  "message": "Login successful",
  "access_token": "string",
  "token_type": "Bearer",
  "user": User
}
```

#### Выход
```typescript
POST /logout
Authorization: Bearer {token}
```

### Пользователи

#### Получить текущего пользователя
```typescript
GET /user
Authorization: Bearer {token}

Response: User
```

#### Обновить профиль
```typescript
PATCH /user
Authorization: Bearer {token}
{
  "name": "string",
  "phone": "string"
}
```

#### Сменить пароль
```typescript
PATCH /user/password
Authorization: Bearer {token}
{
  "current_password": "string",
  "new_password": "string",
  "new_password_confirmation": "string"
}
```

### Поездки

#### Создать поездку
```typescript
POST /trip
Authorization: Bearer {token}
{
  "from_city": "string",
  "to_city": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "seats": "number",
  "price": "number",
  "note": "string (optional)",
  "carModel": "string (optional)",
  "carColor": "string (optional)",
  "numberCar": "string (optional)"
}

Response:
{
  "message": "Поездка создана!",
  "trip": Trip
}
```

#### Получить все поездки
```typescript
GET /trips
Authorization: Bearer {token}

Response:
{
  "trips": Trip[]
}
```

#### Получить мои поездки
```typescript
GET /my-trips
Authorization: Bearer {token}

Response:
{
  "trips": Trip[]
}
```

#### Обновить поездку
```typescript
PATCH /trips/{id}
Authorization: Bearer {token}
{
  // те же поля что и при создании
}

Response:
{
  "message": "Поездка обновлена!",
  "trip": Trip
}
```

#### Удалить поездку
```typescript
DELETE /trips/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Поездка успешно удалена"
}
```

## Типы данных

### User
```typescript
interface User {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}
```

### Trip
```typescript
interface Trip {
  id: number;
  user_id: number;
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  note?: string;
  carModel?: string;
  carColor?: string;
  numberCar?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  driver?: User;
}
```

## Использование в компонентах

### Хук аутентификации
```typescript
import { useAuth } from "@/hooks/use-auth"

const { user, isAuthenticated, login, register, logout, isLoading } = useAuth()
```

### Хук поездок
```typescript
import { useTrips } from "@/hooks/use-trips"

const { trips, myTrips, isLoading, createTrip, updateTrip, deleteTrip } = useTrips()
```

### Прямое использование API клиента
```typescript
import { apiClient } from "@/lib/api"

// Пример создания поездки
const tripData = {
  from_city: "Ташкент",
  to_city: "Самарканд",
  date: "2024-12-25",
  time: "10:00",
  price: 50000,
  seats: 4
}

const response = await apiClient.createTrip(tripData)
```

## Обработка ошибок

Все API вызовы автоматически обрабатывают ошибки и возвращают понятные сообщения:

```typescript
try {
  const response = await apiClient.login(credentials)
  // Успешный вход
} catch (error) {
  // error.message содержит сообщение об ошибке
  console.error("Login failed:", error.message)
}
```

## Настройка окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Тестирование

Для тестирования API интеграции используйте компонент `TestApi` на странице `/api-test`.

## Дополнительные эндпоинты

### Бронирования
- `POST /trips/{trip}/booking` - Создать бронирование
- `GET /bookings` - Мои бронирования
- `PATCH /bookings/{booking}/cancel` - Отменить бронирование

### Чат
- `POST /chats/{trip}/send` - Отправить сообщение
- `GET /chats/{trip}/with/{receiver}` - Получить сообщения чата
- `GET /chats` - Все чаты пользователя

### Уведомления
- `GET /notifications` - Все уведомления
- `PATCH /notifications/{id}/read` - Отметить как прочитанное

### Кошелек
- `GET /wallet` - Баланс кошелька
- `POST /wallet/deposit` - Пополнить кошелек
- `GET /wallet/transactions` - История транзакций

### Рейтинги
- `POST /ratings/{trip}/to/{toUser}` - Поставить оценку
- `GET /ratings/user/{user}` - Отзывы пользователя

### Настройки
- `GET /settings` - Все настройки
- `POST /settings` - Создать/обновить настройку 