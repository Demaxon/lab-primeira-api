// Importações
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Importa a biblioteca do banco
const app = express();
const PORT = 3000;
app.use(express.json());

app.use(express.static('public'));
// === CONFIGURAÇÃO DO BANCO DE DADOS ===
// Cria um novo arquivo chamado 'universidade.db' na raiz do projeto
const db = new sqlite3.Database('./universidade.db', (erro) => {
    if (erro) {
        console.error("Erro ao conectar no banco de dados:", erro.message);
    } else {
        console.log("Conectado ao banco de dados SQLite com sucesso!");
    }
});
// === CRIAÇÃO DA TABELA ===
// Executamos um código SQL para criar a tabela caso ela não exista
db.run(`
CREATE TABLE IF NOT EXISTS alunos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
curso TEXT NOT NULL
)
`, () => {
    console.log("Tabela 'alunos' verificada/criada.");
});

// GET /
app.get('/', (req, res) => {
    res.send('Olá, Mundo! Meu servidor HTTP está funcionando perfeitamente!');
});

// === SIMULADOR DE FALHAS EM CASCATA (PIPELINE DO BANCO) ===
// Esta rota simula um banco de dados sob estresse (gargalo de CPU ou Locks de transação)
app.get('/api/alunos/pipeline-simulador', (request, response) => {
    // Sorteia um número de 1 a 10
    const chanceDeFalha = Math.floor(Math.random() * 10) + 1;
    // Simula um atraso de rede ou processamento lento (1.5 segundos)
    setTimeout(() => {
        if (chanceDeFalha <= 3) {
            // Em 30% dos casos, o banco "cai" e quebra o pipeline
            // O código HTTP 503 indica "Serviço Indisponível" (Internal Error / Cascading Failure)

            return response.status(503).json({
                erro: "Cascading Failure: O pool de conexões do Banco de Dados esgotou."
            });
        }
        // Se sobreviveu à falha, processa a requisição normalmente
        db.all(`SELECT * FROM alunos`, [], (erro, linhas) => {
            if (erro) return response.status(500).json({ erro: erro.message });
            response.status(200).json(linhas);
        });
    }, 1500); // 1500ms de atraso intencional
});

// Rota de busca de alunos (GET)
app.get('/api/alunos', (request, response) => {
    const sql = `SELECT * FROM alunos`;
    // db.all busca múltiplas linhas no banco de dados
    db.all(sql, [], (erro, linhas) => {
        if (erro) {
            return response.status(500).json({ erro: erro.message });
        }
        // Retorna o resultado (linhas) da tabela para o navegador em formato JSON
        response.status(200).json(linhas);
    });
});

// Rota para cadastrar (POST)
app.post('/api/alunos', (request, response) => {
    const { nome, curso } = request.body;
    // Validação básica no Back-end
    if (!nome || !curso) {
        return response.status(400).json({ erro: "Nome e curso são obrigatórios!" });
    }
    // Comando SQL com proteção contra Injeção de SQL (usando ?)
    const sql = `INSERT INTO alunos (nome, curso) VALUES (?, ?)`;
    // db.run executa a Query. Os [nome, curso] substituem as interrogações.
    db.run(sql, [nome, curso], function (erro) {
        if (erro) {
            return response.status(500).json({ erro: erro.message });
        }
        // Se sucesso, 'this.lastID' contém o ID gerado pelo banco
        response.status(201).json({
            mensagem: "Aluno matriculado no Banco de Dados!",
            id_gerado: this.lastID
        });
    });
});

// Rota para excluir (DELETE)
app.delete('/api/alunos/:id', (request, response) => {
    const idParaDeletar = request.params.id;
    const sql = `DELETE FROM alunos WHERE id = ?`;
    db.run(sql, [idParaDeletar], function (erro) {
        if (erro) {
            return response.status(500).json({ erro: erro.message });
        }
        // 'this.changes' diz quantas linhas foram apagadas
        if (this.changes === 0) {
            return response.status(404).json({ erro: "Aluno não encontrado." });
        }
        response.status(200).json({ mensagem: "Registro apagado definitivamente." });
    });
});

console.log("Rota DELETE carregada!");

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});