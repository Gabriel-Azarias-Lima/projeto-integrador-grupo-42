/**
 * Centraliza e valida variáveis de ambiente obrigatórias na inicialização.
 * Lança erro imediatamente se alguma variável crítica estiver ausente.
 */

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://127.0.0.1:5500',
};
