const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { CORS_ORIGIN } = require('./config/env');
const errorMiddleware = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const clientesRoutes = require('./modules/clientes/clientes.routes');
const servicosRoutes = require('./modules/servicos/servicos.routes');
const agendamentosRoutes = require('./modules/agendamentos/agendamentos.routes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, mensagem: 'Muitas requisições. Tente novamente em alguns minutos.' },
}));

app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

app.use((_, res) => res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada.' }));

app.use(errorMiddleware);

module.exports = app;
