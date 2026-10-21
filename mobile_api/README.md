# Agenda Mobile API

API REST para o aplicativo Ionic `projeto_mobile`, com tarefas para as aulas
de consumo de API e persistencia local.

## Banco de dados

A API usa MySQL em `127.0.0.1:3306`, usuario `root`, senha `root` e cria
automaticamente o banco `agenda_mobile` e a tabela `tasks`.

1. Copie `.env.example` para `.env`.
2. Ajuste as variaveis se necessario.
3. Execute `npm start`.

## Rotas

- `GET /health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Testes

Execute `npm test` para verificar a rota de saude sem necessidade de banco.
