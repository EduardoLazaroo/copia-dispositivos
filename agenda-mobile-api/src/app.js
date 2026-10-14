const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Endpoint simples para monitoramento e testes de saude.
app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Tratamento padrao de erro nao capturado nas rotas.
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Erro interno do servidor.' });
});

module.exports = app;
