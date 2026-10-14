const app = require('./app');
const { port } = require('./config');
const { initializeDatabase } = require('./db');

async function start() {
  // Garante schema/tabelas antes de aceitar requisicoes.
  await initializeDatabase();
  app.listen(port, () => console.log(`API em execucao: http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Nao foi possivel iniciar a API. Verifique a conexao MySQL e o arquivo .env.', error.message);
  process.exit(1);
});
