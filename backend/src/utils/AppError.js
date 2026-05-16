/**
 * Erro operacional esperado pela aplicação.
 * Qualquer instância de AppError é tratada pelo middleware global de erros
 * e retornada como resposta JSON com o statusCode definido.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
