# ===============================
# Etapa 1: Build da aplicação
# ===============================
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas package.json e package-lock.json (ou yarn.lock) para aproveitar cache
COPY package*.json ./

# Instala as dependências (em dev)
RUN npm ci

# Copia todo o restante do código-fonte para dentro do container
COPY . .

# Executa o build do Nest (gera a pasta /dist)
RUN npm run build

# ===============================
# Etapa 2: Imagem de produção
# ===============================
FROM node:18-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json para nova imagem (produção)
COPY package*.json ./

# Instala somente dependências de produção
RUN npm ci --omit=dev

# Copia a pasta compilada (dist) da etapa "builder"
COPY --from=builder /app/dist ./dist

# Se você usar .env, copie também (ou defina variáveis de ambiente no docker-compose)
COPY .env ./

# Exponha a porta que a aplicação escuta (caso use 3000)
EXPOSE 3000

# Comando padrão para subir a aplicação em modo de produção
CMD ["node", "dist/main.js"]
