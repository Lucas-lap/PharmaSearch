function buscarMedicamento() {
    const medicamento = document.getElementById('medicamento').value;
    const url = `https://bula.vercel.app/pesquisar?nome=${medicamento}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultadoElement = document.getElementById('resultado');
            const resultadosPesquisa = document.querySelector('.resultados-pesquisa');

            if (data && data.content && data.content.length > 0) {
                let htmlResultado = '';

                data.content.forEach(medicamentoData => {
                    const nomeProdutoFormatado = formatarNomeProduto(medicamentoData.nomeProduto);

                    htmlResultado += `
                        <h2>${nomeProdutoFormatado}</h2>
                        <p>Fabricante: ${medicamentoData.razaoSocial}</p>
                        <button onclick="abrirPaginaDetalhes('${medicamentoData.numProcesso}')">Ver Detalhes do Medicamento</button>
                        <hr>
                    `;
                });

                resultadoElement.innerHTML = htmlResultado;
                resultadosPesquisa.style.display = 'flex'; // Exibe a seção quando houver resultados
            } else {
                resultadoElement.innerHTML = 'Medicamento não encontrado ou sem informações de bula disponíveis.';
                resultadosPesquisa.style.display = 'flex'; // Esconde a seção se não houver resultados
            }
        })
        .catch(error => {
            console.error('Erro ao buscar medicamento:', error);
            const resultadoElement = document.getElementById('resultado');
            const resultadosPesquisa = document.querySelector('.resultados-pesquisa');
            resultadoElement.innerHTML = 'Não foi possível encontrar o medicamento.';
            resultadosPesquisa.style.display = 'flex'; // Exibe a seção se ocorrer um erro
        });
}

// Função para buscar detalhes do medicamento
function buscarDetalhesMedicamento(numProcesso) {
    const url = `https://bula.vercel.app/medicamento/${numProcesso}`;
    const detalhesElement = document.getElementById('detalhes-medicamento');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.nomeComercial) {
                const nomeComercialFormatado = formatarNomeProduto(data.nomeComercial);
                const apresentacoesFormatadas = data.apresentacoes.map(apresentacao => {
                    return `${apresentacao.apresentacao}`; // Ajuste isso conforme a estrutura dos objetos no array
                }).join('<br>');

                // Exibe os detalhes do medicamento selecionado
                detalhesElement.innerHTML = `
                    <h2>${nomeComercialFormatado}</h2>
                    <p>Medicamento Referência: ${data.medicamentoReferencia}</p>
                    <p>Fabricante: ${data.empresa.razaoSocial}</p>
                    <p>Classe: ${data.classesTerapeuticas}</p>
                    <p>Apresentações:</p>
                    <p>${apresentacoesFormatadas}</p>
                `;
                // Mostra o div dos detalhes
                 detalhesElement.style.display = 'block';
            } else {
                detalhesElement.innerHTML = 'Detalhes não disponíveis para este medicamento.';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do medicamento:', error);
            detalhesElement.innerHTML = 'Erro ao buscar os detalhes do medicamento.';
            detalhesElement.style.display = 'block';
        });
}

// Chamar a função para buscar os detalhes
if (numProcesso) {
    buscarDetalhesMedicamento(numProcesso);
} else {
    document.getElementById('detalhes-medicamento').innerHTML = 'Número do processo não fornecido.';
};

function abrirPaginaDetalhes(numProcesso) {
    buscarDetalhesMedicamento(numProcesso); // Chama diretamente a função para exibir os detalhes
}


// Função para formatar o nome do produto com a primeira letra maiúscula
function formatarNomeProduto(nome) {
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
}

// Função para obter parâmetros da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Pegar o número do processo da URL
const numProcesso = getQueryParam('numProcesso');