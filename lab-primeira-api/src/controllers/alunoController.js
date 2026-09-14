const AlunoRepository = require('../repositories/alunoRepository');
const AlunoController = {
listar: (req, res) => {
AlunoRepository.buscarTodos((erro, linhas) => {
if (erro) return res.status(500).json({ erro: erro.message });
res.status(200).json(linhas);
});
},
cadastrar: (req, res) => {
const { nome, curso } = req.body;

if (!nome || !curso) return res.status(400).json({ erro: "Dados incompletos!" });
AlunoRepository.criar(nome, curso, (erro, id) => {
if (erro) return res.status(500).json({ erro: erro.message });
res.status(201).json({ mensagem: "Criado!", id });
});
},
// NOVIDADE: Método para lidar com o PUT
editar: (req, res) => {
const id = req.params.id;
const { nome, curso } = req.body;
AlunoRepository.atualizar(id, nome, curso, (erro, alterados) => {
if (erro) return res.status(500).json({ erro: erro.message });
if (alterados === 0) return res.status(404).json({ erro: "Aluno não encontrado." });
res.status(200).json({ mensagem: "Atualizado com sucesso!" });
});
},
remover: (req, res) => {
const id = req.params.id;
AlunoRepository.deletar(id, (erro, apagados) => {
if (erro) return res.status(500).json({ erro: erro.message });
if (apagados === 0) return res.status(404).json({ erro: "Aluno não encontrado." });
res.status(200).json({ mensagem: "Removido!" });
});
}
};
module.exports = AlunoController;