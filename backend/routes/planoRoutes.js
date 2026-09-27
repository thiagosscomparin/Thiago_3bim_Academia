const express = require('express');
const router = express.Router();
const planoController = require('../controllers/planoController');

// Rotas do CRUD de Plano
router.get('/listar', planoController.listarPlanos);
router.get('/:id', planoController.obterPlano);
router.post('/', planoController.criarPlano);
router.put('/:id', planoController.atualizarPlano);
router.delete('/:id', planoController.deletarPlano);

module.exports = router;