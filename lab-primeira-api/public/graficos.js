// Captura o elemento Canvas na tela
const ctx = document.getElementById('graficoCursos').getContext('2d');

// Função para buscar os dados e montar o gráfico
function carregarGrafico() {

    fetch('/api/alunos/estatisticas')

        .then(resposta => resposta.json())

        .then(dados => {

            // Pega os nomes dos cursos
            const labelsCursos = dados.map(item => item.curso);

            // Pega a quantidade de alunos de cada curso
            const dadosQuantidades = dados.map(item => item.quantidade);

            // Cria o gráfico
            new Chart(ctx, {

                type: 'doughnut',

                data: {

                    labels: labelsCursos,

                    datasets: [{

                        label: 'Número de Alunos',

                        data: dadosQuantidades,

                        backgroundColor: [
                            'rgba(13, 110, 253, 0.7)',
                            'rgba(25, 135, 84, 0.7)',
                            'rgba(255, 193, 7, 0.7)'
                        ],

                        borderColor: [
                            'rgba(13, 110, 253, 1)',
                            'rgba(25, 135, 84, 1)',
                            'rgba(255, 193, 7, 1)'
                        ],

                        borderWidth: 2

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: 'bottom'
                        }

                    }

                }

            });

        })

        .catch(erro => {

            console.error(
                "Erro ao carregar estatísticas:",
                erro
            );

        });
}


// Inicia o gráfico quando a página abrir
carregarGrafico();