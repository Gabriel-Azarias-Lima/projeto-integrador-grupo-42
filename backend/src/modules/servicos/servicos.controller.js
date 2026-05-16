const servicosService = require('./servicos.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ok, criado, semConteudo } = require('../../utils/response');

const listar = asyncHandler(async (req, res) => {
  const servicos = await servicosService.listar(req.query);
  ok(res, { servicos });
});

const obterPorId = asyncHandler(async (req, res) => {
  const servico = await servicosService.obterPorId(Number(req.params.id));
  ok(res, { servico });
});

const criar = asyncHandler(async (req, res) => {
  const servico = await servicosService.criar(req.body);
  criado(res, { servico }, 'Serviço criado com sucesso.');
});

const atualizar = asyncHandler(async (req, res) => {
  const servico = await servicosService.atualizar(Number(req.params.id), req.body);
  ok(res, { servico }, 'Serviço atualizado com sucesso.');
});

const excluir = asyncHandler(async (req, res) => {
  await servicosService.excluir(Number(req.params.id));
  semConteudo(res);
});

module.exports = { listar, obterPorId, criar, atualizar, excluir };
