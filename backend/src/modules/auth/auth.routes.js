const { Router } = require('express');
const authController = require('./auth.controller');
const { autenticar } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { registrarSchema, loginSchema } = require('./auth.validation');

const router = Router();

router.post('/registrar', validate(registrarSchema), authController.registrar);
router.post('/login',     validate(loginSchema),     authController.login);
router.get('/me',         autenticar,                authController.me);

module.exports = router;
