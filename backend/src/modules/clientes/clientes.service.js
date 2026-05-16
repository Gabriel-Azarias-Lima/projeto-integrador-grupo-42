const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

async function atualizar(clienteId, dados) {
  const cliente = await prisma.clientes.update({
    where: { id: clienteId },
    data: dados,
    select: { id: true, nome: true, email: true, telefone: true, criado_em: true },
  });
  return cliente;
}

async function excluir(clienteId) {
  const cliente = await prisma.clientes.findUnique({ where: { id: clienteId } });
  if (!cliente) throw new AppError('Cliente não encontrado.', 404);

  await prisma.clientes.delete({ where: { id: clienteId } });
}

module.exports = { atualizar, excluir };
