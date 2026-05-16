const agendamentosService = require('./agendamentos.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ok, criado } = require('../../utils/response');

const listar = asyncHandler(async (req, res) => {
  const agendamentos = await agendamentosService.listar(req.clienteId);
  ok(res, { agendamentos });
});

const criar = asyncHandler(async (req, res) => {
  const agendamento = await agendamentosService.criar(req.clienteId, req.body);
  criado(res, { agendamento }, 'Agendamento realizado com sucesso.');
});

const reagendar = asyncHandler(async (req, res) => {
  const agendamento = await agendamentosService.reagendar(
    req.clienteId,
    Number(req.params.id),
    req.body,
  );
  ok(res, { agendamento }, 'Agendamento reagendado com sucesso.');
});

const cancelar = asyncHandler(async (req, res) => {
  const agendamento = await agendamentosService.cancelar(
    req.clienteId,
    Number(req.params.id),
  );
  ok(res, { agendamento }, 'Agendamento cancelado com sucesso.');
});

const atualizarStatus = asyncHandler(async (req, res) => {
  const agendamento = await agendamentosService.atualizarStatus(
    req.clienteId,
    Number(req.params.id),
    req.body.status,
  );
  ok(res, { agendamento }, 'Status atualizado com sucesso.');
});

const horariosDisponiveis = asyncHandler(async (req, res) => {
  const excluir = req.query.excluir ? Number(req.query.excluir) : undefined;
  const horarios = await agendamentosService.horariosDisponiveis(req.query.data, excluir);
  ok(res, { horarios });
});

module.exports = { listar, criar, reagendar, cancelar, atualizarStatus, horariosDisponiveis };
