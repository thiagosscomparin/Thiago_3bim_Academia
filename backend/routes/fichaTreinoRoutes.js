const express = require('express');
const router = express.Router();
const fichaTreinoController = require('../controllers/fichaTreinoController');

// Rotas do CRUD de Ficha de Treino
router.get('/listar', fichaTreinoController.listarFichasTreino);
router.get('/aluno/:idAluno', fichaTreinoController.obterFichaPorAluno);
router.get('/:id', fichaTreinoController.obterFichaTreino);
router.post('/', fichaTreinoController.criarFichaTreino);
router.put('/:id', fichaTreinoController.atualizarFichaTreino);
router.delete('/:id', fichaTreinoController.deletarFichaTreino);

module.exports = router;