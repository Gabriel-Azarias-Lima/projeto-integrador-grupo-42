const { NODE_ENV } = require('../config/env');

/**
 * Handler global de erros do Express.
 * Diferencia erros operacionais (AppError) de erros inesperados.
 * Em produção, erros internos não expõem detalhes técnicos.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // Erros de validação do Zod
  if (err.name === 'ZodError') {
    const campos = err.errors.map((e) => ({ campo: e.path.join('.'), mensagem: e.message }));
    return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros: campos });
  }

  // Violação de unique constraint do Prisma (P2002)
  if (err.code === 'P2002') {
    const campo = err.meta?.target?.join(', ') || 'campo';
    return res.status(409).json({ sucesso: false, mensagem: `Já existe um registro com esse ${campo}.` });
  }

  // Registro não encontrado no Prisma (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro não encontrado.' });
  }

  // Pool de conexões Prisma / Supabase (P2024)
  if (err.code === 'P2024') {
    return res.status(503).json({
      sucesso: false,
      mensagem:
        'Banco de dados temporariamente indisponível. Se usa Supabase pooler (porta 6543), confira DATABASE_URL com ?pgbouncer=true e connection_limit=1, ou use a conexão direta (porta 5432).',
    });
  }

  // Erros operacionais conhecidos (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({ sucesso: false, mensagem: err.message });
  }

  // Erro inesperado — loga internamente, não expõe detalhes em produção
  console.error('ERRO NÃO TRATADO:', err);

  const mensagem = NODE_ENV === 'production'
    ? 'Ocorreu um erro interno. Tente novamente.'
    : err.message;

  return res.status(500).json({ sucesso: false, mensagem });
};

module.exports = errorMiddleware;
