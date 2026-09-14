const express = require('express');
const app = express();
const alunoRoutes = require('./src/routes/alunoRoutes');
// Middlewares Globais
app.use(express.json());
app.use(express.static('public'));
// Injeção das Rotas
app.use('/api/alunos', alunoRoutes);
const PORT = 3000;
app.listen(PORT, () => {
console.log(`✅ Servidor rodando na porta ${PORT}. Arquitetura Refatorada!`);
});