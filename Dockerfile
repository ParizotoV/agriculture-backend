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

# Copia apenas a pasta compilada (dist) da etapa "builder"
COPY --from=builder /app/dist ./dist

# Se você usar .env, copie também (ou defina variáveis de ambiente no docker-compose)
# COPY .env ./

# Exponha a porta que a aplicação escuta (caso use 3000)
EXPOSE 3000

# Comando padrão para subir a aplicação em modo de produção
CMD ["sh", "-c", "npx typeorm migration:run && node dist/main.js"]
