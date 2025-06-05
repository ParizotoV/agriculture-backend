
# Brain Agriculture API

API para gerenciar produtores rurais, fazendas, colheitas e dashboard.

---

## 🔧 Pré-requisitos

- **Node.js** (>= v18) e **npm**  
- **PostgreSQL** (>= v13) ou **Docker** (para rodar DB via container)  
- **Yarn** (opcional)

---

## 📂 Estrutura do Repositório

```
.
├── src
│   ├── common
│   │   ├── filters
│   │   │   └── typeorm-exception.filter.ts
│   │   ├── interceptors
│   │   │   └── logging.interceptor.ts
│   │   └── pipes
│   │       └── cpf-cnpj-validation.pipe.ts
│   ├── config
│   │   └── typeorm.config.ts
│   ├── modules
│   │   ├── producer
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── producer.controller.ts
│   │   │   ├── producer.service.ts
│   │   │   └── producer.module.ts
│   │   ├── farm
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── farm.controller.ts
│   │   │   ├── farm.service.ts
│   │   │   ├── farm.module.ts
│   │   │   └── validators
│   │   │       └── area-sum.validator.ts
│   │   ├── crop
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── crop.controller.ts
│   │   │   ├── crop.service.ts
│   │   │   └── crop.module.ts
│   │   └── dashboard
│   │       ├── dashboard.controller.ts
│   │       ├── dashboard.service.ts
│   │       └── dashboard.module.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── producer.e2e-spec.ts
│   ├── farm.e2e-spec.ts
│   ├── crop.e2e-spec.ts
│   ├── dashboard.e2e-spec.ts
│   └── common
│       ├── pipes
│       │   └── cpf-cnpj-validation.pipe.spec.ts
│       ├── validators
│       │   └── area-sum.validator.spec.ts
│       └── interceptors
│           └── logging.interceptor.spec.ts
├── docs
│   ├── er-diagram.pdf          ← Diagrama ER do banco de dados
│   └── flow-diagram.png        ← (Opcional) Diagrama de fluxo das requisições
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── ormconfig.ts
├── jest.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🚀 Instalação e Configuração

1. Clone este repositório:  
   \`\`\`bash
   git clone https://github.com/seu-usuario/brain-agriculture-api.git
   cd brain-agriculture-api
   \`\`\`

2. Instale as dependências:  
   \`\`\`bash
   npm install
   # ou
   yarn install
   \`\`\`

3. Copie o arquivo de ambiente e configure as variáveis:  
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Em seguida, ajuste os valores em \`.env\`:
   \`\`\`env
   # .env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=brain_agriculture
   JWT_SECRET=algumsegredoseguro
   \`\`\`

---

## 🐘 Rodando localmente com PostgreSQL

### 1. Usando o PostgreSQL instalado localmente

1. Crie o banco de dados:  
   \`\`\`bash
   psql -U seu_usuario -h localhost
   CREATE DATABASE brain_agriculture;
   \q
   \`\`\`

2. Atualize \`.env\` com as credenciais corretas.

3. Execute as migrations (se aplicável) ou deixe \`synchronize: true\` no \`ormconfig.ts\` para sincronizar automaticamente (apenas em desenvolvimento).

4. Inicie a aplicação em modo dev:  
   \`\`\`bash
   npm run start:dev
   # ou
   yarn start:dev
   \`\`\`

A aplicação ficará disponível em \`http://localhost:3000\`.

---

### 2. Usando Docker (PostgreSQL + API)

1. Certifique-se de ter Docker & Docker Compose instalados.

2. No \`docker-compose.yml\` (na raiz do projeto), verifique se há um serviço para o banco de dados. Exemplo mínimo:

   \`\`\`yaml
   version: '3.8'
   services:
     db:
       image: postgres:13
       environment:
         POSTGRES_DB: brain_agriculture
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
       ports:
         - '5432:5432'
       volumes:
         - pgdata:/var/lib/postgresql/data
     api:
       build: .
       ports:
         - '3000:3000'
       environment:
         - PORT=3000
         - DB_HOST=db
         - DB_PORT=5432
         - DB_USER=postgres
         - DB_PASS=postgres
         - DB_NAME=brain_agriculture
       depends_on:
         - db
   volumes:
     pgdata:
   \`\`\`

3. Build e suba os containers:  
   \`\`\`bash
   docker-compose up --build
   \`\`\`

4. Abra \`http://localhost:3000\` no navegador. A API estará rodando e aguardando requisições.

---

## ✅ Rodando Testes

### 1. Testes Unitários e de Integração (Jest)

Para executar todos os testes unitários e de integração, execute:

\`\`\`bash
npm run test
# ou
yarn test
\`\`\`

O Jest executará os arquivos \`*.spec.ts\` e exibirá o resultado.

### 2. Testes E2E (End-to-End)

Caso tenha a configuração específica para E2E (por exemplo, banco em memória ou Docker), execute:

\`\`\`bash
npm run test:e2e
# ou
yarn test:e2e
\`\`\`

Isso iniciará a aplicação dentro de um ambiente de teste, rodará os testes E2E em \`test/*.e2e-spec.ts\` e exibirá relatórios de sucesso/falha.

### 3. Coverage (Cobertura ≥ 80%)

Para gerar o relatório de cobertura:

\`\`\`bash
npm run test:cov
# ou
yarn test:cov
\`\`\`

Ao término, verá um sumário indicando porcentagem de cobertura por pasta e arquivo. Certifique-se de que **Statements**, **Branches**, **Functions** e **Lines** estejam ≥ 80 %.

---

## 📝 Acessando o Swagger (Documentação)

Após iniciar a aplicação (modo dev ou prod), abra no navegador:

\`\`\`
http://localhost:3000/api
\`\`\`

Você verá a interface do **Swagger UI**, onde pode explorar todos os endpoints, visualizar DTOs, testar requisições diretamente e conferir exemplos de payload.

O JSON da especificação pode ser obtido em:

\`\`\`
http://localhost:3000/api-json
\`\`\`

---

## 🗂️ Diagramas

### 1. Diagrama ER do Banco de Dados

O diagrama ER (Entidade-Relacionamento) está disponível em:

- **Arquivo PDF**: [\`docs/er-diagram.pdf\`](docs/er-diagram.pdf)  
- **Visualização Rápida (link)**:  
  [Clique aqui para ver o Diagrama ER no navegador](https://www.dbdiagram.io/d/placeholder-brain-agriculture)  

No diagrama, você verá tabelas como:
- \`producer\` (produtores)  
- \`farm\` (fazendas), com *foreign key* para \`producer.id\`  
- \`crop\` (colheitas), com *foreign key* para \`farm.id\`  
- Relacionamentos 1-N: um produtor → várias fazendas, uma fazenda → várias colheitas.

### 2. Diagrama de Fluxo (Opcional)

Para entender o fluxo de requisições:

\`\`\`
Cliente → [Controller] → [Service] → [Repository/TypeORM] → [Banco de Dados]
         ← (response JSON de volta ao cliente)
\`\`\`

![Diagrama de Fluxo](docs/flow-diagram.png)

> Caso não tenha o arquivo \`flow-diagram.png\`, você pode criar um diagrama no [draw.io](https://draw.io) ou [Mermaid Live](https://mermaid.live) e salvar em \`docs/flow-diagram.png\`.

---

## ⚙️ Configuração de Ambiente

### Arquivo \`.env.example\`

\`\`\`env
# Porta da API
PORT=3000

# Configuração do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=brain_agriculture

# (Opcional) JWT para autenticação
JWT_SECRET=algumsegredoseguro
JWT_EXPIRES_IN=3600s
\`\`\`

Renomeie para \`.env\` antes de rodar localmente e ajuste conforme seu ambiente. Em produção, use variáveis de ambiente ou serviços de secret management.

---

## 📦 Docker e Deploy

### Dockerfile

\`\`\`dockerfile
# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY .env ./
CMD ["node", "dist/main.js"]
\`\`\`

### docker-compose.yml

\`\`\`yaml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: brain_agriculture
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - db

volumes:
  pgdata:
\`\`\`

Para subir em produção (ou em seu servidor):

\`\`\`bash
docker-compose up --build -d
\`\`\`

---

## 📜 Migrations e Seeders

Se você habilitar migrations no **TypeORM**, crie diretório \`src/migrations\` e configure em \`ormconfig.ts\`. Por exemplo:

\`\`\`ts
// ormconfig.ts
import { DataSource } from 'typeorm';
import { Producer } from './src/modules/producer/entities/producer.entity';
import { Farm } from './src/modules/farm/entities/farm.entity';
import { Crop } from './src/modules/crop/entities/crop.entity';

export const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Producer, Farm, Crop],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // false em produção
});
\`\`\`

Gerar e rodar migrations:

\`\`\`bash
npm run migration:generate --name=NomeDaSuaMigration
npm run typeorm migration:run
\`\`\`

Para dados de teste iniciais (seeders), você pode criar um script \`src/seeds/seed.ts\` que use repositórios para inserir registros default.

---

## 🔒 Segurança

- **Validações**:  
  - \`ValidationPipe\` global remove campos não whitelist.  
  - DTOs (\`class-validator\`) garantem tipos e padrões (ex.: CPF/CNPJ, soma de áreas).

- **Tratamento de erros**:  
  - \`AllExceptionsFilter\` ou \`TypeOrmExceptionFilter\` para uniformizar respostas de erro (404, 400, 500).  
  - \`LoggingInterceptor\` para registrar requisições e erros.

- **CORS**:  
  Se precisar habilitar, no \`main.ts\`:
  \`\`\`ts
  app.enableCors({
    origin: 'https://dominio-seguro.com',
  });
  \`\`\`

- **Rate limiting (opcional)**:  
  Instale \`@nestjs/throttler\` e adicione em \`AppModule\`:
  \`\`\`ts
  import { ThrottlerModule } from '@nestjs/throttler';

  @Module({
    imports: [
      ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
      // ...
    ],
  })
  export class AppModule {}
  \`\`\`

---

## 📖 Referências

- [NestJS Documentation](https://docs.nestjs.com)  
- [TypeORM Documentation](https://typeorm.io)  
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)  
- [Swagger (OpenAPI) com NestJS](https://docs.nestjs.com/openapi/introduction)  

---

<small>Este README cobre como configurar, rodar localmente (psql ou Docker), executar testes, acessar a documentação Swagger e inclui os diagramas de ER e fluxo para orientar o desenvolvimento e deploy da Brain Agriculture API.</small>
