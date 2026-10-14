# Agenda Mobile API

API REST para o aplicativo Ionic `projeto_mobile`, com usuarios, autenticacao JWT e tarefas por usuario.

## Banco de dados

A API usa MySQL em `127.0.0.1:3306`, usuario `root`, senha `root` e cria automaticamente o banco `agenda_mobile` e as tabelas `users` e `tasks`.

1. Copie `.env.example` para `.env`.
2. Ajuste as variaveis se necessario.
3. Execute `npm start`.

## Rotas

- `GET /health`
- `POST /api/auth/register` com `{ "username", "password" }`
- `POST /api/auth/login` com `{ "username", "password" }`
- `GET /api/tasks` com `Authorization: Bearer <token>`
- `POST /api/tasks` com `Authorization: Bearer <token>`
- `PUT /api/tasks/:id` com `Authorization: Bearer <token>`
- `DELETE /api/tasks/:id` com `Authorization: Bearer <token>`

## Testes

Execute `npm test` para verificar a rota de saude sem necessidade de banco.
