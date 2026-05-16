const clientesService = require('./clientes.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ok, semConteudo } = require('../../utils/response');

const atualizar = asyncHandler(async (req, res) => {
  const cliente = await clientesService.atualizar(req.clienteId, req.body);
  ok(res, { cliente }, 'Perfil atualizado com sucesso.');
});

const excluir = asyncHandler(async (req, res) => {
  await clientesService.excluir(req.clienteId);
  semConteudo(res);
});

module.exports = { atualizar, excluir };
