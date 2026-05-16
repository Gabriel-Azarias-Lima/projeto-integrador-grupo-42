const { Router } = require('express');
const servicosController = require('./servicos.controller');
const { autenticar } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { criarSchema, atualizarSchema, filtroSchema } = require('./servicos.validation');

const router = Router();

// Rotas públicas
router.get('/', validate(filtroSchema, 'query'), servicosController.listar);
router.get('/:id', servicosController.obterPorId);

// Rotas administrativas (protegidas por autenticação — adicionar role de admin em evolução futura)
router.post('/',      autenticar, validate(criarSchema),     servicosController.criar);
router.patch('/:id',  autenticar, validate(atualizarSchema), servicosController.atualizar);
router.delete('/:id', autenticar,                            servicosController.excluir);

module.exports = router;
