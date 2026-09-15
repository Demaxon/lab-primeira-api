// Carrega as variáveis do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const alunoRoutes = require('./src/routes/alunoRoutes');

const app = express();

// === MIDDLEWARES GLOBAIS ===

// Permite requisições de outros Front-ends
app.use(cors());

// Gera logs das requisições no terminal
app.use(morgan('dev'));

// Permite receber dados em JSON
app.use(express.json());

// Permite acessar os arquivos da pasta public
app.use(express.static('public'));

// === ROTAS ===

app.use('/api/alunos', alunoRoutes);

// === SERVIDOR ===

// Pega a porta definida no .env
// Se não encontrar, utiliza 3000
const PORT = process.env.PORTA_SERVIDOR || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}. Protegido por CORS e monitorado por Morgan!`);
});