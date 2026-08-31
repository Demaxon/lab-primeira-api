// === LIFTING STATE UP: O Estado Global da Aplicação ===
const estadoApp = {
    alunos: [], // Guarda a lista de alunos na memória do navegador
    carregando: false // Indica se estamos aguardando o Back-end
};

// === MANIPULAÇÃO DE OBJETOS DO HTML ===
const DOM = {
    lista: document.getElementById('listaAlunos'),
    inputNome: document.getElementById('inputNome'),
    selectCurso: document.getElementById('selectCurso'),
    btnCadastrar: document.getElementById('btnCadastrar'),
    alerta: document.getElementById('alertaSistema')
};

// Função unificada para renderizar a tela baseada no estadoApp
function renderizarTela() {
    DOM.lista.innerHTML = '';
    
    // Renderiza cada aluno a partir do estado global
    estadoApp.alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        // Uso do atributo data-id para o Event Delegation
        li.innerHTML = `
            <span><strong>${aluno.nome}</strong> - ${aluno.curso}</span>
            <button class="btn btn-danger btn-sm btn-delete" data-id="${aluno.id}">Remover</button>
        `;
        DOM.lista.appendChild(li);
    });
}

// === EVENT DELEGATION ===
// Um único ouvinte na Lista (elemento pai) intercepta os cliques dos botões filhos
DOM.lista.addEventListener('click', function (evento) {
    // Verifica se o elemento clicado tem a classe 'btn-delete'
    if (evento.target.classList.contains('btn-delete')) {
        // Puxa o ID que guardamos no atributo 'data-id'
        const id = evento.target.getAttribute('data-id');
        deletarAluno(id);
    }
});

// Evento do botão de cadastro
DOM.btnCadastrar.addEventListener('click', cadastrarAluno);

// === COMUNICAÇÃO COM O BACK-END ===

// Função para buscar a lista de alunos (GET)
function carregarAlunos() {
    estadoApp.carregando = true;

    // Utiliza a rota do simulador de pipeline criada no servidor
    fetch('/api/alunos/pipeline-simulador')
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Falha no servidor. Código: " + resposta.status);
            }
            return resposta.json();
        })
        .then(dados => {
            DOM.alerta.classList.add('d-none'); // Esconde o alerta de erro se der sucesso
            estadoApp.alunos = dados; // Atualiza o estado global (Lifting State Up)
            estadoApp.carregando = false;
            renderizarTela(); // Atualiza a interface a partir do estado
        })
        .catch(erro => {
            estadoApp.carregando = false;
            exibirErro("Falha em Cascata detectada: " + erro.message);
        });
}

// Função para cadastrar um novo aluno (POST)
function cadastrarAluno() {
    const nome = DOM.inputNome.value.trim();
    const curso = DOM.selectCurso.value;

    if (nome === "") {
        exibirErro("Por favor, digite o nome do aluno!");
        return;
    }

    const novoAluno = { nome: nome, curso: curso };

    fetch('/api/alunos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoAluno)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao realizar o cadastro. Código: " + resposta.status);
        }
        return resposta.json();
    })
    .then(() => {
        DOM.inputNome.value = ""; // Limpa o campo de texto
        carregarAlunos(); // Atualiza a lista via pipeline
    })
    .catch(erro => exibirErro("Erro ao cadastrar: " + erro.message));
}

// Função para remover um aluno (DELETE)
function deletarAluno(idDoAluno) {
    if (confirm("Tem certeza que deseja remover este aluno?")) {
        fetch(`/api/alunos/${idDoAluno}`, {
            method: 'DELETE'
        })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro ao remover o aluno. Código: " + resposta.status);
            }
            return resposta.json();
        })
        .then(() => {
            carregarAlunos(); // Atualiza a lista via pipeline
        })
        .catch(erro => exibirErro("Erro ao excluir: " + erro.message));
    }
}

// Função utilitária para exibir erros na tela
function exibirErro(mensagem) {
    DOM.alerta.textContent = mensagem;
    DOM.alerta.classList.remove('d-none');
}

// Inicializa a aplicação ao carregar a página
carregarAlunos();