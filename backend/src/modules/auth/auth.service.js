const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/env');

const gerarToken = (clienteId) =>
  jwt.sign({ sub: clienteId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const formatarCliente = ({ senha: _, ...cliente }) => cliente;

async function registrar({ nome, email, senha, telefone }) {
  const existente = await prisma.clientes.findUnique({ where: { email } });
  if (existente) throw new AppError('E-mail já cadastrado.', 409);

  const senhaHash = await argon2.hash(senha);

  const cliente = await prisma.clientes.create({
    data: { nome, email, senha: senhaHash, telefone },
  });

  return { cliente: formatarCliente(cliente), token: gerarToken(cliente.id) };
}

async function login({ email, senha }) {
  const cliente = await prisma.clientes.findUnique({ where: { email } });

  const senhaValida = cliente && await argon2.verify(cliente.senha, senha);
  if (!senhaValida) throw new AppError('E-mail ou senha incorretos.', 401);

  return { cliente: formatarCliente(cliente), token: gerarToken(cliente.id) };
}

async function obterPerfil(clienteId) {
  const cliente = await prisma.clientes.findUnique({
    where: { id: clienteId },
    select: { id: true, nome: true, email: true, telefone: true, criado_em: true },
  });
  if (!cliente) throw new AppError('Cliente não encontrado.', 404);
  return cliente;
}

module.exports = { registrar, login, obterPerfil };
