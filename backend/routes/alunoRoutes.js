const express = require('express');
const multer = require('multer');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Configura o Multer para armazenar em memória temporária para o Sharp processar
const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de Alunos
router.get('/listar', alunoController.listarAlunos);
router.get('/:id', alunoController.obterAluno);
router.post('/', alunoController.criarAluno);
router.put('/:id', alunoController.atualizarAluno);
router.delete('/:id', alunoController.deletarAluno);

// Rota para upload da foto
router.post('/upload/:id', upload.single('foto'), alunoController.uploadImagem);

module.exports = router;