const { z } = require('zod');

const atualizarSchema = z.object({
  nome:     z.string().trim().min(2).max(150).optional(),
  telefone: z.string().trim().max(20).optional(),
}).strict();

module.exports = { atualizarSchema };
