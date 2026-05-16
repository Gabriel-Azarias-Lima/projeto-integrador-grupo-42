require('dotenv').config();

const app = require('./src/app');
const prisma = require('./src/config/database');
const { PORT } = require('./src/config/env');

const server = app.listen(PORT, () => {
  console.log(`🚀 Studio Elegance API rodando na porta ${PORT} [${process.env.NODE_ENV}]`);
});

async function shutdown(signal) {
  console.log(`\nEncerrando (${signal})…`);
  try {
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
  }
  server.close(() => process.exit(0));
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
