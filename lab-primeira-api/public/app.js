// === 2.4.6 DOM (Document Object Model) ===
// Capturando os elementos estruturais da tela
const DOM = {
    lista: document.getElementById('listaAlunos'),
    inputNome: document.getElementById('inputNome'),
    selectCurso: document.getElementById('selectCurso'),
    btnCadastrar: document.getElementById('btnCadastrar'),
    alerta: document.getElementById('alertaSistema'),
    metricaTotal: document.getElementById('metricaTotal'),
    relogio: document.getElementById('relogioSistema')
};
// Estado Centralizado
const estadoApp = { alunos: [] };
// === 2.4.3 Interações: Relógio em Tempo Real ===
setInterval(() => {
    const agora = new Date();
    DOM.relogio.textContent = agora.toLocaleTimeString('pt-BR');
}, 1000);
// === RENDERIZAÇÃO E ATUALIZAÇÃO DO DASHBOARD ===
const renderizarDashboard = () => {
    DOM.lista.innerHTML = '';
    // Atualiza a Métrica (Contador Dinâmico)
    DOM.metricaTotal.textContent = estadoApp.alunos.length;
    // Constrói as linhas da Tabela (Objetos HTML)
    estadoApp.alunos.forEach(aluno => {
        const tr = document.createElement('tr');

        tr.className = "linha-nova"; // Dispara a animação CSS ao nascer
        tr.innerHTML = `
<td class="fw-bold text-secondary">#${aluno.id}</td>
<td>${aluno.nome}</td>
<td><span class="badge bg-info text-dark">${aluno.curso}</span></td>
<td class="text-end">
<button class="btn btn-outline-danger btn-sm btn-delete" data-id="${aluno.id}">
✖ Excluir
</button>
</td>
`;
        DOM.lista.appendChild(tr);
        // Remove a cor de "novo" após 2 segundos
        setTimeout(() => tr.classList.remove('linha-nova'), 2000);
    });
}
// === 2.4.5 Manipulação de Eventos (Event Delegation) ===
DOM.lista.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-delete')) {
        const id = evento.target.getAttribute('data-id');
        deletarAluno(id);
    }
});
DOM.btnCadastrar.addEventListener('click', cadastrarAluno);
// === INTEGRAÇÃO COM BACK-END (Funções) ===
function carregarAlunos() {
    fetch('/api/alunos/pipeline-simulador')
        .then(resposta => {
            if (!resposta.ok) throw new Error("Falha Crítica no Banco de Dados (503).");
            return resposta.json();
        })
        .then(dados => {
            DOM.alerta.classList.add('d-none');
            estadoApp.alunos = dados;
            renderizarDashboard();
        })
        .catch(erro => {

            DOM.alerta.textContent = erro.message;
            DOM.alerta.classList.remove('d-none');
        });
}
// 2.4.4 Funções: Cadastro
function cadastrarAluno() {
    const novoAluno = {
        nome: DOM.inputNome.value,
        curso: DOM.selectCurso.value
    };
    if (!novoAluno.nome) return alert("O nome é obrigatório!");
    fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAluno)
    })
        .then(resposta => {
            if (resposta.status === 201) {
                DOM.inputNome.value = "";
                carregarAlunos(); // Recarrega e atualiza as métricas
            }
        });
}
// 2.4.4 Funções: Exclusão
const deletarAluno = (id) => {
    if (confirm("Confirmar exclusão definitiva?")) {
        fetch(`/api/alunos/${id}`, { method: 'DELETE' })
            .then(resposta => {
                if (resposta.status === 200) carregarAlunos();
            });
    }
}
// Inicializa a aplicação ao abrir
carregarAlunos();