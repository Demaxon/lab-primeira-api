// ================================
// CONTROLE DE EDIÇÃO
// ================================

let idEdicao = null;


// ================================
// ELEMENTOS DO DOM
// ================================

const DOM = {
    inputNome: document.getElementById('inputNome'),
    selectCurso: document.getElementById('selectCurso'),
    btnCadastrar: document.getElementById('btnCadastrar'),
    listaAlunos: document.getElementById('listaAlunos'),
    metricaTotal: document.getElementById('metricaTotal'),
    alertaSistema: document.getElementById('alertaSistema'),
    relogioSistema: document.getElementById('relogioSistema')
};


// ================================
// CARREGAR ALUNOS
// ================================

const carregarAlunos = () => {

    fetch('/api/alunos')
        .then(resposta => {

            if (!resposta.ok) {
                throw new Error('Erro ao buscar os alunos.');
            }

            return resposta.json();
        })
        .then(alunos => {

            DOM.listaAlunos.innerHTML = '';

            DOM.metricaTotal.textContent = alunos.length;

            alunos.forEach(aluno => {

                const linha = document.createElement('tr');

                linha.innerHTML = `
                    <td>${aluno.id}</td>

                    <td>${aluno.nome}</td>

                    <td>${aluno.curso}</td>

                    <td class="text-end">

                        <button
                            class="btn btn-warning btn-sm btn-editar"
                            data-id="${aluno.id}"
                            data-nome="${aluno.nome}"
                            data-curso="${aluno.curso}">
                            Editar
                        </button>

                        <button
                            class="btn btn-danger btn-sm btn-deletar"
                            data-id="${aluno.id}">
                            Excluir
                        </button>

                    </td>
                `;

                DOM.listaAlunos.appendChild(linha);
            });
        })
        .catch(erro => {

            console.error(erro);

            DOM.alertaSistema.textContent =
                'Não foi possível carregar os alunos.';

            DOM.alertaSistema.classList.remove('d-none');
        });
};


// ================================
// CADASTRAR / EDITAR ALUNO
// ================================

const cadastrarAluno = () => {

    const nome = DOM.inputNome.value.trim();
    const curso = DOM.selectCurso.value;

    if (!nome) {

        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Digite o nome do aluno.'
        });

        return;
    }

    const dados = {
        nome: nome,
        curso: curso
    };

    // Se existe um ID, significa que estamos editando
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

            if (!resposta.ok) {
                throw new Error('Erro ao realizar a operação.');
            }

            return resposta.json();
        })
        .then(() => {

            // Limpa o formulário
            DOM.inputNome.value = "";

            idEdicao = null;

            DOM.btnCadastrar.textContent = "Adicionar";

            DOM.btnCadastrar.classList.remove('btn-warning');
            DOM.btnCadastrar.classList.add('btn-success');

            // Atualiza a lista
            carregarAlunos();

            // Toast de sucesso
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Operação realizada com sucesso!',
                showConfirmButton: false,
                timer: 2000
            });
        })
        .catch(erro => {

            console.error(erro);

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível realizar a operação.'
            });
        });
};


// ================================
// DELETAR ALUNO
// ================================

const deletarAluno = (id) => {

    // Modal moderno do SweetAlert2
    Swal.fire({

        title: 'Tem certeza?',

        text: 'Esta ação apagará o aluno do Banco de Dados!',

        icon: 'warning',

        showCancelButton: true,

        confirmButtonColor: '#d33',

        cancelButtonColor: '#3085d6',

        confirmButtonText: 'Sim, excluir!',

        cancelButtonText: 'Cancelar'

    }).then((resultado) => {

        // Se o usuário confirmou
        if (resultado.isConfirmed) {

            fetch(`/api/alunos/${id}`, {
                method: 'DELETE'
            })
                .then(resposta => {

                    if (resposta.status === 200) {

                        Swal.fire(
                            'Excluído!',
                            'O registro foi removido.',
                            'success'
                        );

                        carregarAlunos();
                    }

                    else {

                        throw new Error('Erro ao excluir o aluno.');
                    }
                })
                .catch(erro => {

                    console.error(erro);

                    Swal.fire(
                        'Erro!',
                        'Não foi possível excluir o registro.',
                        'error'
                    );
                });
        }
    });
};


// ================================
// EVENTOS DA TABELA
// ================================

DOM.listaAlunos.addEventListener('click', (evento) => {

    const botao = evento.target;

    // ============================
    // BOTÃO EDITAR
    // ============================

    if (botao.classList.contains('btn-editar')) {

        idEdicao = botao.dataset.id;

        DOM.inputNome.value = botao.dataset.nome;

        DOM.selectCurso.value = botao.dataset.curso;

        DOM.btnCadastrar.textContent = "Atualizar";

        DOM.btnCadastrar.classList.remove('btn-success');
        DOM.btnCadastrar.classList.add('btn-warning');

        DOM.inputNome.focus();
    }


    // ============================
    // BOTÃO EXCLUIR
    // ============================

    if (botao.classList.contains('btn-deletar')) {

        const id = botao.dataset.id;

        deletarAluno(id);
    }
});


// ================================
// BOTÃO CADASTRAR / ATUALIZAR
// ================================

DOM.btnCadastrar.addEventListener('click', cadastrarAluno);


// ================================
// RELÓGIO DO SISTEMA
// ================================

const atualizarRelogio = () => {

    const agora = new Date();

    const hora = agora.toLocaleTimeString('pt-BR');

    DOM.relogioSistema.textContent = hora;
};

setInterval(atualizarRelogio, 1000);

atualizarRelogio();


// ================================
// INICIALIZAÇÃO
// ================================

carregarAlunos();