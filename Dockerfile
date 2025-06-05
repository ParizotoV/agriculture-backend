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
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copia a pasta compilada (dist) da etapa "builder"
COPY --from=builder /app/dist ./dist

# Se estiver usando migrations em TS, copie também:
COPY --from=builder /app/data-source.ts ./data-source.ts
COPY --from=builder /app/src/migrations ./src/migrations

EXPOSE 3000

# Antes de iniciar o Nest, rode as migrations apontando para o dist/data-source.js
CMD ["sh", "-c", "npx typeorm migration:run -d dist/data-source.js && node dist/main.js"]
