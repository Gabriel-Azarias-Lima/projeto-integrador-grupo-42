const { z } = require('zod');

const registrarSchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório.' }).trim().min(2, 'Nome muito curto.').max(150),
  email: z.string({ required_error: 'E-mail é obrigatório.' }).email('E-mail inválido.').max(180),
  senha: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(8, 'Senha deve ter no mínimo 8 caracteres.')
    .max(100),
  telefone: z
    .string({ required_error: 'Telefone é obrigatório.' })
    .trim()
    .min(8, 'Informe um telefone válido.')
    .max(20, 'Telefone muito longo.'),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'E-mail é obrigatório.' }).email('E-mail inválido.'),
  senha: z.string({ required_error: 'Senha é obrigatória.' }).min(1, 'Senha é obrigatória.'),
});

module.exports = { registrarSchema, loginSchema };
