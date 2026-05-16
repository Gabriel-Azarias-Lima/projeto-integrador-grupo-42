/**
 * Middleware de validação com Zod.
 * Recebe um schema Zod e valida o `req.body` ou `req.query`.
 * Lança ZodError em caso de falha, tratado pelo error middleware global.
 */
const validate = (schema, origem = 'body') => (req, _, next) => {
  schema.parse(req[origem]);
  next();
};

module.exports = validate;
