const { z } = require('zod');

const STATUS_VALIDOS = ['pendente', 'confirmado', 'cancelado', 'concluido'];

const HORARIOS_DISPONIVEIS = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:30'];

const criarSchema = z.object({
  fk_id_servico: z.number({ required_error: 'ID do serviço é obrigatório.' }).int().positive(),
  data_hora_inicio: z
    .string({ required_error: 'Data e hora são obrigatórias.' })
    .datetime({ message: 'Formato de data/hora inválido. Use ISO 8601.' }),
});

const atualizarStatusSchema = z.object({
  status: z.enum(STATUS_VALIDOS, {
    errorMap: () => ({ message: `Status deve ser: ${STATUS_VALIDOS.join(', ')}.` }),
  }),
});

const reagendarSchema = z.object({
  data_hora_inicio: z
    .string({ required_error: 'Data e hora são obrigatórias.' })
    .datetime({ message: 'Formato de data/hora inválido. Use ISO 8601.' }),
});

const horariosQuerySchema = z.object({
  data:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD.'),
  servico_id:   z.string().regex(/^\d+$/).optional(),
  excluir:      z.string().regex(/^\d+$/).optional(),
});

module.exports = {
  criarSchema,
  atualizarStatusSchema,
  reagendarSchema,
  horariosQuerySchema,
  STATUS_VALIDOS,
  HORARIOS_DISPONIVEIS,
};
