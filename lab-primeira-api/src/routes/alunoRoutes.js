const express = require('express');

const router = express.Router();

const AlunoController = require('../controllers/alunoController');

// Mapeamento Limpo e Semântico (API REST)

router.get('/', AlunoController.listar);

// Analytics - Estatísticas por curso
router.get('/estatisticas', AlunoController.estatisticas);

router.post('/', AlunoController.cadastrar);

router.put('/:id', AlunoController.editar);

router.delete('/:id', AlunoController.remover);

module.exports = router;