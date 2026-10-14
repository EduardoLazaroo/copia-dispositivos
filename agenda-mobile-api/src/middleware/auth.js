const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function authenticate(request, response, next) {
  const [scheme, token] = (request.headers.authorization ?? '').split(' ');

  // Requer padrao Authorization: Bearer <token>.
  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Token de autenticacao ausente.' });
  }

  try {
    // Decodifica claims e injeta usuario autenticado na request.
    request.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return response.status(401).json({ message: 'Token de autenticacao invalido ou expirado.' });
  }
}

module.exports = { authenticate };
