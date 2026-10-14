# Dragons Working Management — Plataforma de Jornada

Primeira versão da plataforma interna de registro de jornada (Dungeons & Dragons Group, operação Brasil ↔ Europa).

## Stack

| Camada   | Tecnologia                    |
| -------- | ----------------------------- |
| Frontend | Angular 22 (standalone, TS)   |
| Backend  | NestJS + TypeScript (CJS/Jest)|
| Banco    | SQL Server 2022+              |
| Auth     | JWT (8h) + bcrypt             |

**Decisões**
- Backend em NestJS em vez de .NET: linguagem única (TS), arquitetura equivalente (modules, DI, controllers) e entrega mais rápida. SQL Server mantido, aderente ao ecossistema Microsoft.
- Todo evento de jornada é salvo em **UTC** (`datetimeoffset`) com o **fuso IANA de origem** (`America/Sao_Paulo`, `Europe/Lisbon`...). O front exibe o fuso gravado — cobre remoto + viagens entre países.
- Máquina de estados no backend: sem `CLOCK_IN` duplo, sem `CLOCK_OUT` sem jornada aberta, pausa só dentro de jornada aberta.
- `synchronize: true` apenas para desenvolvimento. Produção exige migration.

## Pré-requisitos

- Node 20+ e npm
- SQL Server 2022+ acessível em `localhost:1433` (nativo ou Docker)
- 2 terminais (backend :3000, frontend :4200)

## Como executar

```bash
# 1. clonar
git clone https://github.com/telinii/Dragons-Working-Management.git
cd Dragons-Working-Management

# 2. banco — crie o database JornadaDb (login SA)
# via sqlcmd (Linux/macOS, usando a imagem Docker só como client):
docker run --rm --network host mcr.microsoft.com/mssql/server:2022-latest \
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P 'sua-senha' \
  -Q "IF DB_ID('JornadaDb') IS NULL CREATE DATABASE JornadaDb" -C
# no Windows com SSMS/Azure Data Studio: conecte em localhost e rode
# CREATE DATABASE JornadaDb;

# 3. backend
cd backend
npm install
cp .env.example .env   # se não existir, crie com o modelo abaixo
npm run start:dev      # http://localhost:3000

# 4. frontend (outro terminal)
cd frontend
npm install
npm start              # http://localhost:4200
```

**`backend/.env`** (não commitado — preencha tudo, o backend não sobe sem `DB_PASS` e `JWT_SECRET`):
```
DB_HOST=localhost
DB_PORT=1433
DB_USER=SA
DB_PASS=sua-senha
DB_NAME=JornadaDb
JWT_SECRET=uma-string-longa-qualquer
```

Com Docker (banco alternativo — Linux/macOS):
```bash
docker run -d --name sqlserver-jornada \
  -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SuaSenha@123" \
  -p 1434:1433 mcr.microsoft.com/mssql/server:2022-latest
# use DB_PORT=1434 no .env
```

No Windows (PowerShell):
```powershell
# usa ` (acento grave) para quebrar linha, ou tudo em uma linha
docker run -d --name sqlserver-jornada `
  -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SuaSenha@123" `
  -p 1434:1433 mcr.microsoft.com/mssql/server:2022-latest

# no lugar de cp:
copy backend\.env.example backend\.env
# edite o .env no bloco de notas/VS Code
```
Se já tiver SQL Server nativo no Windows, use `DB_HOST=localhost` e `DB_PORT=1433` direto, sem Docker.

## Primeiro uso

Acesse `http://localhost:4200/cadastro`, crie sua conta (escolha o fuso) e entre em `/login` → `/ponto` (Entrada, Pausa, Saída) → `/historico` (consulta do mês, com hora local convertida).

Via API, o equivalente:
```bash
# criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Seu Nome","email":"voce@empresa.com","password":"123456","timezone":"America/Sao_Paulo"}'
```

Depois acesse `http://localhost:4200/login` com esse email/senha → `/ponto` (Entrada, Pausa, Saída) → `/historico` (consulta do mês).

## API

| Método | Rota                     | Auth   | Descrição                          |
| ------ | ------------------------ | ------ | ---------------------------------- |
| POST   | `/users`                 | não    | Cadastra usuário                   |
| POST   | `/auth/login`            | não    | Retorna `{ access_token }`         |
| POST   | `/work-events`           | Bearer | `{ type, timestampUtc?, timezone?, note? }` |
| GET    | `/work-events/me?month=` | Bearer | Lista eventos do mês (`2026-10`)   |

Tipos de evento: `CLOCK_IN`, `BREAK_START`, `BREAK_END`, `CLOCK_OUT`.

## Estrutura

```
./
  backend/    # NestJS (src/users, src/auth, src/work-events)
  frontend/   # Angular Material (core/auth, core/jornada, pages/login, cadastro, ponto, historico)
```

## Limitações conhecidas (v1)

- Sem refresh token / recuperação de senha.
- Sem papéis (roles) aplicados nas rotas — `role` existe no modelo para evoluir (gestor/RH).
- Sem docker-compose e sem migrations — próximos passos.
