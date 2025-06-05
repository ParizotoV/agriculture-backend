# ===============================
# Etapa 1: Build da aplicação
# ===============================
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===============================
# Etapa 2: Imagem de produção
# ===============================
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "\
  npx typeorm migration:run -d dist/data-source.js && \
  node dist/src/main.js\
"]
