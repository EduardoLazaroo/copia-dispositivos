# Projeto Mobile Master - Desenvolvimento de Aplicativos Moveis

Aplicativo de referencia da disciplina de Desenvolvimento de Aplicativos Moveis (UNIVEM), planejado para evolucao em 20 semanas.

## Stack oficial
- Ionic 8
- Angular 20
- TypeScript
- Capacitor

## Funcionalidades implementadas nesta base real
- Autenticacao local (didatica) com sessao persistida.
- Rotas protegidas com guard.
- Interceptor para envio de token em chamadas HTTP.
- Gerenciamento de tarefas (criar, concluir, remover, importar da API).
- Detalhe e edicao de tarefas com passagem de parametro por rota.
- Persistencia de preferencias com Capacitor Preferences e localStorage.
- Persistencia robusta de tarefas com Ionic Storage.
- Recursos nativos por tarefa: camera, geolocalizacao e notificacoes locais.

## Estrutura principal
- src/app/core: services, models, guards, interceptors.
- src/app/features/auth/login: acesso ao app.
- src/app/features/tabs: navegacao principal com abas.
- src/app/features/tasks: fluxo de tarefas e detalhe/edicao.
- src/app/features/calendar: visao de prazos de tarefas.
- src/app/features/settings: preferencias do usuario e sessao.

## Executar localmente

```powershell
Set-Location "c:\Users\eduar\projetos\planejamento_docencia\projeto_mobile"
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install
npm run start
```

## Build de producao

```powershell
npm run build
```

## Mapeamento pedagógico
A matriz de rastreabilidade por semana esta em:
- docs/matriz_20_semanas.md

Arquitetura e backlog:
- docs/arquitetura_projeto_master.md
- docs/backlog_fases.md
