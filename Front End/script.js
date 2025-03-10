document.getElementById('formImovel').addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const preco = document.getElementById('preco').value;
    const fotos = document.getElementById('fotos').value.split(',');
    const rua = document.getElementById('rua').value;

    const apartamento = {
        titulo: titulo,
        preco: parseInt(preco),
        fotos: fotos.map(foto => foto.trim()),
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
        // Limpa a lista existente
        while (listaImoveis.firstChild) {
            listaImoveis.removeChild(listaImoveis.firstChild);
        }
        // Adiciona os anúncios à lista
        apartamentos.forEach(apartamento => {
            const anuncio = document.createElement('div');
            anuncio.classList.add('anuncio'); // Adiciona uma classe para estilização

            // Adiciona a imagem do apartamento
            if (apartamento.fotos && apartamento.fotos.length > 0) {
                const imagem = document.createElement('img');
                imagem.src = apartamento.fotos[0]; // Exibe a primeira foto
                imagem.classList.add('anuncio-imagem'); // Adiciona classe CSS
                anuncio.appendChild(imagem);
            }

            const titulo = document.createElement('h2');
            titulo.textContent = apartamento.titulo;
            titulo.classList.add('anuncio-titulo'); // Adiciona classe CSS
            anuncio.appendChild(titulo);

            const preco = document.createElement('p');
            preco.textContent = `R$ ${apartamento.valor}`;
            preco.classList.add('anuncio-preco'); // Adiciona classe CSS
            anuncio.appendChild(preco);

            // Adiciona o endereço do apartamento
            if (apartamento.endereco && apartamento.endereco.rua) {
                const endereco = document.createElement('p');
                endereco.textContent = `Rua: ${apartamento.endereco.rua}`;
                endereco.classList.add('anuncio-endereco'); // Adiciona classe CSS
                anuncio.appendChild(endereco);
            }

            listaImoveis.appendChild(anuncio);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar anúncios:', error);
    });

    // Função para buscar um imóvel por ID
async function buscarApartamento(id) {
    const response = await fetch(`http://localhost:3000/apartamentos/${id}`);
    return response.json();
}

// Função para preencher o formulário de edição
function preencherFormularioEdicao(apartamento) {
    document.getElementById('editTitulo').value = apartamento.titulo;
    document.getElementById('editPreco').value = apartamento.preco;
    document.getElementById('editFotos').value = apartamento.fotos.join(',');
    document.getElementById('editRua').value = apartamento.endereco.rua;
    document.getElementById('editId').value = apartamento.id;
}

// Função para enviar os dados atualizados
async function atualizarApartamento(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const titulo = document.getElementById('editTitulo').value;
    const preco = document.getElementById('editPreco').value;
    const fotos = document.getElementById('editFotos').value.split(',');
    const rua = document.getElementById('editRua').value;

    const apartamento = {
        titulo,
        preco,
        fotos: fotos.map(foto => foto.trim()),
        endereco: { rua }
    };

    try {
        const response = await fetch(`http://localhost:3000/apartamentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apartamento)
        });

        if (response.ok) {
            alert('Apartamento atualizado com sucesso!');
            window.location.reload();
        } else {
            alert('Erro ao atualizar apartamento.');
        }
    } catch (error) {
        alert('Erro ao enviar requisição.');
    }
}