const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ok, criado } = require('../../utils/response');

const registrar = asyncHandler(async (req, res) => {
  const resultado = await authService.registrar(req.body);
  criado(res, resultado, 'Cadastro realizado com sucesso.');
});

const login = asyncHandler(async (req, res) => {
  const resultado = await authService.login(req.body);
  ok(res, resultado, 'Login realizado com sucesso.');
});

const me = asyncHandler(async (req, res) => {
  const cliente = await authService.obterPerfil(req.clienteId);
  ok(res, { cliente });
});

module.exports = { registrar, login, me };
