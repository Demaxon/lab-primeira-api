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
const estadoApp = {
    alunos: []
};

// Controla se estamos cadastrando ou editando
let idEdicao = null;


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

    // Constrói as linhas da Tabela
    estadoApp.alunos.forEach(aluno => {

        const tr = document.createElement('tr');

        tr.className = "linha-nova";

        tr.innerHTML = `
            <td class="fw-bold text-secondary">#${aluno.id}</td>

            <td>${aluno.nome}</td>

            <td>
                <span class="badge bg-info text-dark">
                    ${aluno.curso}
                </span>
            </td>

            <td class="text-end">

                <!-- BOTÃO EDITAR -->
                <button
                    class="btn btn-outline-warning btn-sm btn-edit me-2"
                    data-id="${aluno.id}"
                    data-nome="${aluno.nome}"
                    data-curso="${aluno.curso}">
                    ✎ Editar
                </button>

                <!-- BOTÃO EXCLUIR -->
                <button
                    class="btn btn-outline-danger btn-sm btn-delete"
                    data-id="${aluno.id}">
                    ✖ Excluir
                </button>

            </td>
        `;

        DOM.lista.appendChild(tr);

        // Remove a animação depois de 2 segundos
        setTimeout(() => {
            tr.classList.remove('linha-nova');
        }, 2000);
    });
};


// === 2.4.5 Manipulação de Eventos (Event Delegation) ===

DOM.lista.addEventListener('click', (evento) => {

    // === EXCLUIR ===

    if (evento.target.classList.contains('btn-delete')) {

        const id = evento.target.getAttribute('data-id');

        deletarAluno(id);
    }


    // === EDITAR ===

    if (evento.target.classList.contains('btn-edit')) {

        const id = evento.target.getAttribute('data-id');
        const nome = evento.target.getAttribute('data-nome');
        const curso = evento.target.getAttribute('data-curso');

        // Coloca os dados do aluno no formulário
        DOM.inputNome.value = nome;
        DOM.selectCurso.value = curso;

        // Guarda o ID que está sendo editado
        idEdicao = id;

        // Altera o botão para modo de edição
        DOM.btnCadastrar.textContent = "Atualizar";

        // Troca a cor verde para amarela
        DOM.btnCadastrar.classList.replace(
            'btn-success',
            'btn-warning'
        );
    }
});


// === BOTÃO CADASTRAR / ATUALIZAR ===

DOM.btnCadastrar.addEventListener('click', cadastrarAluno);


// === INTEGRAÇÃO COM BACK-END ===


// Carrega todos os alunos
function carregarAlunos() {

    fetch('/api/alunos')

        .then(resposta => {

            if (!resposta.ok) {
                throw new Error(
                    "Falha Crítica no Banco de Dados (503)."
                );
            }

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


// === CADASTRAR OU EDITAR ===

function cadastrarAluno() {

    const dados = {
        nome: DOM.inputNome.value,
        curso: DOM.selectCurso.value
    };

    // Validação do nome
    if (!dados.nome) {
        return alert("O nome é obrigatório!");
    }


    // Se existe idEdicao, estamos editando
    const url = idEdicao
        ? `/api/alunos/${idEdicao}`
        : '/api/alunos';

    const metodo = idEdicao
        ? 'PUT'
        : 'POST';


    fetch(url, {

        method: metodo,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(dados)

    })

        .then(resposta => {

            if (resposta.ok) {

                // Limpa o formulário
                DOM.inputNome.value = "";

                // Sai do modo de edição
                idEdicao = null;

                // Volta o botão para Adicionar
                DOM.btnCadastrar.textContent = "Adicionar";

                // Volta a cor verde
                DOM.btnCadastrar.classList.replace(
                    'btn-warning',
                    'btn-success'
                );

                // Atualiza a tabela
                carregarAlunos();
            }
        });
}


// === EXCLUSÃO ===

const deletarAluno = (id) => {

    if (confirm("Confirmar exclusão definitiva?")) {

        fetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        })

            .then(resposta => {

                if (resposta.status === 200) {

                    carregarAlunos();
                }
            });
    }
};


// === INICIALIZAÇÃO ===

// Carrega os alunos quando a página abrir
carregarAlunos();

