const { Router } = require('express');
const clientesController = require('./clientes.controller');
const { autenticar } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { atualizarSchema } = require('./clientes.validation');

const router = Router();

router.use(autenticar);

router.patch('/', validate(atualizarSchema), clientesController.atualizar);
router.delete('/', clientesController.excluir);

module.exports = router;
