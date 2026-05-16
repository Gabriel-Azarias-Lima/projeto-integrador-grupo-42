const { Router } = require('express');
const agendamentosController = require('./agendamentos.controller');
const { autenticar } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  criarSchema,
  atualizarStatusSchema,
  reagendarSchema,
  horariosQuerySchema,
} = require('./agendamentos.validation');

const router = Router();

router.use(autenticar);

router.get('/',                    agendamentosController.listar);
router.get('/horarios-disponiveis', validate(horariosQuerySchema, 'query'), agendamentosController.horariosDisponiveis);
router.post('/',                   validate(criarSchema),           agendamentosController.criar);
router.patch('/:id/reagendar',     validate(reagendarSchema),       agendamentosController.reagendar);
router.patch('/:id/cancelar',      agendamentosController.cancelar);
router.patch('/:id/status',        validate(atualizarStatusSchema), agendamentosController.atualizarStatus);

module.exports = router;
