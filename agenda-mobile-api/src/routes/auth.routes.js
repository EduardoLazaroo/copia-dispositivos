const { randomUUID } = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');
const { jwtSecret } = require('../config');

const router = express.Router();

function sessionFor(user) {
  // Token curto para uso didatico; producao exige estrategia mais completa.
  return {
    token: jwt.sign({ sub: user.id, username: user.username }, jwtSecret, { expiresIn: '8h' }),
    username: user.username,
    loggedAt: new Date().toISOString(),
  };
}

router.post('/register', async (request, response, next) => {
  try {
    const { username, password } = request.body;
    // Cadastro exige usuario e senha minima.
    if (!username?.trim() || !password || password.length < 6) {
      return response.status(400).json({ message: 'Informe usuario e senha com ao menos 6 caracteres.' });
    }

    const pool = getPool();
    const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existing.length) {
      return response.status(409).json({ message: 'Este usuario ja esta cadastrado.' });
    }

    const user = { id: randomUUID(), username: username.trim() };
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.execute('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)', [user.id, user.username, passwordHash]);
    return response.status(201).json(sessionFor(user));
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const { username, password } = request.body;
    const [users] = await getPool().execute('SELECT id, username, password_hash FROM users WHERE username = ?', [username?.trim() ?? '']);
    const user = users[0];

    // Compara senha em hash para nao expor credenciais em texto puro.
    if (!user || !(await bcrypt.compare(password ?? '', user.password_hash))) {
      return response.status(401).json({ message: 'Usuario ou senha invalidos.' });
    }

    return response.json(sessionFor(user));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
