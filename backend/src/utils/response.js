/**
 * Respostas padronizadas para toda a API.
 * Garante consistência no formato JSON retornado ao cliente.
 */

const ok = (res, dados, mensagem = 'Operação realizada com sucesso.', status = 200) =>
  res.status(status).json({ sucesso: true, mensagem, dados });

const criado = (res, dados, mensagem = 'Recurso criado com sucesso.') =>
  ok(res, dados, mensagem, 201);

const semConteudo = (res) => res.status(204).send();

const erro = (res, mensagem = 'Erro interno.', status = 500) =>
  res.status(status).json({ sucesso: false, mensagem });

module.exports = { ok, criado, semConteudo, erro };
