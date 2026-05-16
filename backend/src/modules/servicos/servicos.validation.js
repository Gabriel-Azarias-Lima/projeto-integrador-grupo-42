const { z } = require('zod');

const CATEGORIAS_VALIDAS = ['cabelo', 'unhas', 'estetica'];

const criarSchema = z.object({
  categoria:       z.enum(CATEGORIAS_VALIDAS, { errorMap: () => ({ message: `Categoria deve ser: ${CATEGORIAS_VALIDAS.join(', ')}.` }) }),
  nome:            z.string().trim().min(2).max(150),
  descricao:       z.string().trim().max(1000).optional(),
  preco:           z.number({ invalid_type_error: 'Preço deve ser um número.' }).positive('Preço deve ser positivo.'),
  duracao_minutos: z.number().int().positive('Duração deve ser um número inteiro positivo.'),
  imagem_url:      z.string().url('URL da imagem inválida.').optional(),
  ativo:           z.boolean().optional(),
});

const atualizarSchema = criarSchema.partial();

const filtroSchema = z.object({
  categoria: z.enum([...CATEGORIAS_VALIDAS, 'todos']).optional(),
  ativo:     z.enum(['true', 'false']).optional(),
}).optional();

module.exports = { criarSchema, atualizarSchema, filtroSchema, CATEGORIAS_VALIDAS };
