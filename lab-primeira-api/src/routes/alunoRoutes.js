const express = require('express');
const router = express.Router();

const AlunoController = require('../controllers/alunoController');
// Mapeamento Limpo e Semântico (API REST)
router.get('/', AlunoController.listar);
router.post('/', AlunoController.cadastrar);
router.put('/:id', AlunoController.editar); // Nova Rota PUT
router.delete('/:id', AlunoController.remover);
module.exports = router;