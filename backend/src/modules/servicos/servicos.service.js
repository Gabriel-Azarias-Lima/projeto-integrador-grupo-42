const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

async function listar({ categoria, ativo } = {}) {
  const where = {};

  if (categoria && categoria !== 'todos') where.categoria = categoria;

  // Por padrão, retorna apenas serviços ativos
  where.ativo = ativo !== undefined ? ativo === 'true' : true;

  return prisma.servicos.findMany({
    where,
    orderBy: [{ categoria: 'asc' }, { nome: 'asc' }],
  });
}

async function obterPorId(id) {
  const servico = await prisma.servicos.findUnique({ where: { id } });
  if (!servico) throw new AppError('Serviço não encontrado.', 404);
  return servico;
}

async function criar(dados) {
  return prisma.servicos.create({ data: dados });
}

async function atualizar(id, dados) {
  await obterPorId(id);
  return prisma.servicos.update({ where: { id }, data: dados });
}

async function excluir(id) {
  await obterPorId(id);
  await prisma.servicos.update({ where: { id }, data: { ativo: false } });
}

module.exports = { listar, obterPorId, criar, atualizar, excluir };
