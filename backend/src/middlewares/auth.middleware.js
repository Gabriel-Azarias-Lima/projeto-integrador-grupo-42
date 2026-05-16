const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { JWT_SECRET } = require('../config/env');

/**
 * Verifica o JWT enviado no header Authorization: Bearer <token>.
 * Injeta `req.clienteId` para uso nos controllers protegidos.
 */
const autenticar = (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação ausente.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.clienteId = payload.sub;
    next();
  } catch {
    next(new AppError('Token inválido ou expirado.', 401));
  }
};

module.exports = { autenticar };
