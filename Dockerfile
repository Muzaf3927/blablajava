# 1. Билдим приложение
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Устанавливаем pnpm и зависимости
RUN npm install -g pnpm && pnpm install

# Копируем исходный код
COPY . .

# Билдим приложение
RUN pnpm build

# 2. Production-слой
FROM node:18-alpine

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json для установки production зависимостей
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Устанавливаем только production зависимости
RUN pnpm install --prod

# Копируем собранное приложение
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

ENV NODE_ENV=production
ENV PORT=3030

EXPOSE 3030

CMD ["pnpm", "start"]