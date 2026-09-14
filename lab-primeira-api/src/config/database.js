const sqlite3 = require('sqlite3').verbose();
// Conecta ao banco existente na raiz do projeto
const db = new sqlite3.Database('./universidade.db', (erro) => {
if (erro) console.error("❌ Erro no BD:", erro.message);
else console.log("✅ Conectado ao banco de dados SQLite.");
});
module.exports = db;