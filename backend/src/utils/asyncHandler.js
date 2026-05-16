/**
 * Wrapper que elimina try/catch repetitivo nos controllers.
 * Erros assíncronos são propagados automaticamente para o Express.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
