const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { HORARIOS_DISPONIVEIS } = require('./agendamentos.validation');

const incluirRelacoes = {
  servico: {
    select: { id: true, nome: true, categoria: true, preco: true, duracao_minutos: true, imagem_url: true },
  },
};

async function listar(clienteId) {
  return prisma.agendamentos.findMany({
    where: { fk_id_cliente: clienteId },
    include: incluirRelacoes,
    orderBy: { data_hora_inicio: 'desc' },
  });
}

async function criar(clienteId, { fk_id_servico, data_hora_inicio }) {
  const servico = await prisma.servicos.findUnique({ where: { id: fk_id_servico } });
  if (!servico || !servico.ativo) throw new AppError('Serviço não encontrado ou inativo.', 404);

  const dataHora = new Date(data_hora_inicio);
  if (dataHora <= new Date()) throw new AppError('A data e hora devem ser no futuro.', 400);

  // Impede duplicação: mesmo cliente, mesmo serviço, mesma data/hora
  const conflito = await prisma.agendamentos.findFirst({
    where: {
      fk_id_cliente: clienteId,
      fk_id_servico,
      data_hora_inicio: dataHora,
      status: { notIn: ['cancelado'] },
    },
  });
  if (conflito) throw new AppError('Você já possui um agendamento para este serviço neste horário.', 409);

  const agendamento = await prisma.agendamentos.create({
    data: { fk_id_cliente: clienteId, fk_id_servico, data_hora_inicio: dataHora, status: 'pendente' },
    include: incluirRelacoes,
  });

  return agendamento;
}

async function reagendar(clienteId, agendamentoId, { data_hora_inicio }) {
  const agendamento = await prisma.agendamentos.findFirst({
    where: { id: agendamentoId, fk_id_cliente: clienteId },
  });

  if (!agendamento) throw new AppError('Agendamento não encontrado.', 404);
  if (['cancelado', 'concluido'].includes(agendamento.status)) {
    throw new AppError(`Não é possível reagendar um agendamento com status "${agendamento.status}".`, 400);
  }

  const dataHora = new Date(data_hora_inicio);
  if (dataHora <= new Date()) throw new AppError('A data e hora devem ser no futuro.', 400);

  const conflito = await prisma.agendamentos.findFirst({
    where: {
      id: { not: agendamentoId },
      data_hora_inicio: dataHora,
      status: { notIn: ['cancelado'] },
    },
  });
  if (conflito) throw new AppError('Este horário já está ocupado. Escolha outro.', 409);

  return prisma.agendamentos.update({
    where: { id: agendamentoId },
    data: { data_hora_inicio: dataHora },
    include: incluirRelacoes,
  });
}

async function cancelar(clienteId, agendamentoId) {
  const agendamento = await prisma.agendamentos.findFirst({
    where: { id: agendamentoId, fk_id_cliente: clienteId },
  });

  if (!agendamento) throw new AppError('Agendamento não encontrado.', 404);
  if (['cancelado', 'concluido'].includes(agendamento.status)) {
    throw new AppError(`Não é possível cancelar um agendamento com status "${agendamento.status}".`, 400);
  }

  return prisma.agendamentos.update({
    where: { id: agendamentoId },
    data: { status: 'cancelado' },
    include: incluirRelacoes,
  });
}

async function atualizarStatus(clienteId, agendamentoId, status) {
  const agendamento = await prisma.agendamentos.findFirst({
    where: { id: agendamentoId, fk_id_cliente: clienteId },
  });
  if (!agendamento) throw new AppError('Agendamento não encontrado.', 404);

  return prisma.agendamentos.update({
    where: { id: agendamentoId },
    data: { status },
    include: incluirRelacoes,
  });
}

/**
 * Retorna os horários disponíveis para uma data específica.
 * Remove horários já ocupados por agendamentos ativos naquele dia.
 */
async function horariosDisponiveis(data, excluirAgendamentoId) {
  const inicio = new Date(`${data}T00:00:00.000Z`);
  const fim    = new Date(`${data}T23:59:59.999Z`);

  const where = {
    data_hora_inicio: { gte: inicio, lte: fim },
    status: { notIn: ['cancelado'] },
  };
  if (excluirAgendamentoId) {
    where.id = { not: excluirAgendamentoId };
  }

  const agendados = await prisma.agendamentos.findMany({
    where,
    select: { data_hora_inicio: true },
  });

  const horariosOcupados = new Set(
    agendados.map((a) => {
      const d = new Date(a.data_hora_inicio);
      return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
    }),
  );

  return HORARIOS_DISPONIVEIS.filter((h) => !horariosOcupados.has(h));
}

module.exports = { listar, criar, reagendar, cancelar, atualizarStatus, horariosDisponiveis };
