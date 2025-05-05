document.addEventListener('DOMContentLoaded', function () {

    // Seu código de envio de formulário para cadastro de imóvel
    document.getElementById('formImovel').addEventListener('submit', async (event) => {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const preco = document.getElementById('preco').value;
        const rua = document.getElementById('rua').value;

        const apartamento = {
            titulo: titulo,
            preco: parseInt(preco),
            endereco: {
                rua: rua
            }
        };

        try {
            const response = await fetch('http://localhost:3000/apartamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apartamento)
            });

            if (response.ok) {
                alert('Apartamento cadastrado com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao cadastrar apartamento.');
            }
        } catch (error) {
            alert('Erro ao enviar requisição.');
        }
    });

    // Busca os anúncios do backend e exibe na lista
    fetch('http://localhost:3000/apartamentos')
        .then(response => response.json())
        .then(apartamentos => {
            const listaImoveis = document.getElementById('listaImoveis');
            
            while (listaImoveis.firstChild) {
                listaImoveis.removeChild(listaImoveis.firstChild);
            }

            // Adiciona os anúncios à lista
            apartamentos.forEach(apartamento => {
                const anuncio = document.createElement('div');
                anuncio.classList.add('anuncio'); // Adiciona uma classe para estilização

                const titulo = document.createElement('h2');
                titulo.textContent = apartamento.titulo;
                titulo.classList.add('anuncio-titulo'); // Adiciona classe CSS
                anuncio.appendChild(titulo);

                const preco = document.createElement('p');
                preco.textContent = `R$ ${apartamento.preco}`;
                preco.classList.add('anuncio-preco'); // Adiciona classe CSS
                anuncio.appendChild(preco);

                // Adiciona o endereço do apartamento
                if (apartamento.endereco && apartamento.endereco.rua) {
                    const endereco = document.createElement('p');
                    endereco.textContent = `Rua: ${apartamento.endereco.rua}`;
                    endereco.classList.add('anuncio-endereco'); // Adiciona classe CSS
                    anuncio.appendChild(endereco);
                }

                // Adiciona o botão de exclusão
                const botaoExcluir = document.createElement('button');
                botaoExcluir.textContent = 'Excluir';
                botaoExcluir.classList.add('botao-excluir'); // Adiciona uma classe para estilização
                
                // Adiciona um ouvinte de evento para o botão de exclusão
                botaoExcluir.addEventListener('click', () => {
                    excluirApartamento(apartamento.id);
                });
                
                anuncio.appendChild(botaoExcluir);

                // Botão de editar com ícone de lápis no canto superior direito
                const botaoEditar = document.createElement('button');
                botaoEditar.innerHTML = '<i class="fa fa-pencil-alt"></i>'; // Adicionando o ícone de lápis
                botaoEditar.classList.add('botao-editar');

                botaoEditar.addEventListener('click', async () => {
                    document.getElementById('modalEdicao').style.display = 'block'; 
                    preencherFormularioEdicao(apartamento);  // Preenche o formulário com os dados do imóvel
                });

                // Posiciona o botão de editar no canto superior direito
                botaoEditar.classList.add('botao-editar-posicao');
                anuncio.appendChild(botaoEditar);

                listaImoveis.appendChild(anuncio);
            });
            
        })
        .catch(error => {
            console.error('Erro ao buscar anúncios:', error);
        });

    // Função para excluir um imóvel
    async function excluirApartamento(id) {
        try {
            const url = `http://localhost:3000/apartamentos/${id}`;
            console.log('URL da requisição DELETE:', url); // Adicione este log
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Apartamento excluído com sucesso!');
                window.location.reload(); // Recarrega a página para atualizar a lista
            } else {
                alert('Erro ao excluir apartamento.');
            }
        } catch (error) {
            alert('Erro ao enviar requisição.');
        }
    }

    // Função para buscar um imóvel por ID
    async function buscarApartamento(id) {
        const response = await fetch(`http://localhost:3000/apartamentos/${id}`);
        return response.json();
    }

    // Função para preencher o formulário de edição
    async function preencherFormularioEdicao(apartamento) {
        try {
            console.log(apartamento);  // Verifica os dados do apartamento
            if (!apartamento.id) {
                throw new Error("Imóvel não possui ID.");
            }

            document.getElementById('editId').value = apartamento.id;
            document.getElementById('editTitulo').value = apartamento.titulo;
            document.getElementById('editPreco').value = apartamento.preco;  // Alteração para preco
            document.getElementById('editRua').value = apartamento.endereco?.rua || '';
            
        } catch (erro) {
            console.error("Erro ao preencher formulário de edição:", erro);
        }
    }

    // Função para enviar os dados atualizados
    async function atualizarApartamento(event) {
        event.preventDefault();

        const id = document.getElementById('editId').value;
        const titulo = document.getElementById('editTitulo').value;
        const preco = parseFloat(document.getElementById('editPreco').value);
        if(isNaN(preco)) {
            alert('Preço Invalido');
            return;
        }
        const rua = document.getElementById('editRua').value;

        if (!id) {
            alert('ID do imóvel não encontrado');
            return;
        }

        const apartamento = {
            titulo,
            preco,  // Preço ajustado
            endereco: { rua }
        };

        try {
            const resposta = await fetch(`http://localhost:3000/apartamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apartamento)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao atualizar imóvel");
            }

            alert('Imóvel atualizado com sucesso!');
            document.getElementById('modalEdicao').style.display = 'none';
            window.location.reload();  // Recarrega a página para mostrar as alterações
        } catch (erro) {
            console.error("Erro ao atualizar imóvel:", erro);
        }
    }

    // Fechar o modal de edição ao clicar no "X"
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modalEdicao').style.display = 'none';
    });

    // Adicionar o ouvinte de evento para o envio do formulário de edição
    document.getElementById('formEdicao').addEventListener('submit', atualizarApartamento);
});
