const mysql = require('mysql2/promise');
const { db } = require('./config');

let pool;

async function initializeDatabase() {
  // Conexao inicial sem DB para criar schema se necessario.
  const bootstrap = await mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
  });

  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await bootstrap.end();

  // Pool principal usado pelas rotas da API.
  pool = mysql.createPool({
    ...db,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(160) NOT NULL,
      description TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      priority ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'media',
      due_date DATETIME NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
    )
  `);
}

function getPool() {
  if (!pool) {
    // Evita uso da API antes da inicializacao completa.
    throw new Error('Banco de dados ainda nao foi inicializado.');
  }

  return pool;
}

module.exports = { getPool, initializeDatabase };
