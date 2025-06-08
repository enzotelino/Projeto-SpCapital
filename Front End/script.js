document.addEventListener('DOMContentLoaded', function () {

    const API_BASE_URL = 'http://localhost:3000';

    document.getElementById('formImovel').addEventListener('submit', async (event) => {
        event.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const preco = document.getElementById('preco').value;
        const rua = document.getElementById('rua').value;
        const imageUrl = document.getElementById('imageUrl').value;

        const apartamento = {
            titulo: titulo,
            preco: parseInt(preco),
            endereco: { rua: rua },
            imageUrl: imageUrl || null
        };

        console.log("Objeto apartamento a ser enviado:", apartamento);
        console.log("JSON.stringify(apartamento):", JSON.stringify(apartamento));

        try {
            const response = await fetch(`${API_BASE_URL}/apartamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apartamento)
            });

            if (response.ok) {
                alert('Apartamento cadastrado com sucesso!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar apartamento: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            alert('Erro ao enviar requisição.');
        }
    });


    // --- BUSCA E EXIBIÇÃO DOS ANÚNCIOS (GET) ---
    fetch(`${API_BASE_URL}/apartamentos`)
        .then(response => response.json())
        .then(apartamentos => {
            const listaImoveis = document.getElementById('listaImoveis');
            
            while (listaImoveis.firstChild) {
                listaImoveis.removeChild(listaImoveis.firstChild);
            }

            apartamentos.forEach(apartamento => {
                const anuncio = document.createElement('div');
                anuncio.classList.add('anuncio');

                if (apartamento.imageUrl) {
                    const img = document.createElement('img');
                    
                    img.src = `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(apartamento.imageUrl)}`;
                    img.alt = apartamento.titulo;
                    img.classList.add('anuncio-imagem');
                    anuncio.appendChild(img);
                }

                const titulo = document.createElement('h2');
                titulo.textContent = apartamento.titulo;
                titulo.classList.add('anuncio-titulo');
                anuncio.appendChild(titulo);

                const preco = document.createElement('p');
                preco.textContent = `R$ ${apartamento.preco}`;
                preco.classList.add('anuncio-preco');
                anuncio.appendChild(preco);

                if (apartamento.endereco && apartamento.endereco.rua) {
                    const endereco = document.createElement('p');
                    endereco.textContent = `Rua: ${apartamento.endereco.rua}`;
                    endereco.classList.add('anuncio-endereco');
                    anuncio.appendChild(endereco);
                }

                const botaoExcluir = document.createElement('button');
                botaoExcluir.textContent = 'Excluir';
                botaoExcluir.classList.add('botao-excluir');
                botaoExcluir.addEventListener('click', () => {
                    excluirApartamento(apartamento.id);
                });
                anuncio.appendChild(botaoExcluir);

                const botaoEditar = document.createElement('button');
                botaoEditar.innerHTML = '<i class="fa fa-pencil-alt"></i>';
                botaoEditar.classList.add('botao-editar');
                botaoEditar.addEventListener('click', async () => {
                    document.getElementById('modalEdicao').style.display = 'block'; 
                    preencherFormularioEdicao(apartamento);
                });
                botaoEditar.classList.add('botao-editar-posicao');
                anuncio.appendChild(botaoEditar);

                listaImoveis.appendChild(anuncio);
            });
            
        })
        .catch(error => {
            console.error('Erro ao buscar anúncios:', error);
            alert('Erro ao carregar anúncios.');
        });

    // --- FUNÇÃO DE EXCLUIR APARTAMENTO //
    async function excluirApartamento(id) {
        if (!confirm('Tem certeza que deseja excluir este apartamento?')) {
            return;
        }
        try {
            const url = `${API_BASE_URL}/apartamentos/${id}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Apartamento excluído com sucesso!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Erro ao excluir apartamento: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao enviar requisição de exclusão:', error);
            alert('Erro ao enviar requisição de exclusão.');
        }
    }

    // FUNÇÃO PARA PREENCHER FORMULÁRIO DE EDIÇÃO 
    async function preencherFormularioEdicao(apartamento) {
        try {
            document.getElementById('editId').value = apartamento.id;
            document.getElementById('editTitulo').value = apartamento.titulo;
            document.getElementById('editPreco').value = apartamento.preco;
            document.getElementById('editRua').value = apartamento.endereco?.rua || '';
            document.getElementById('editImageUrl').value = apartamento.imageUrl || '';
            
            const currentImagePreview = document.getElementById('currentImagePreview');
            currentImagePreview.innerHTML = '';

            if (apartamento.imageUrl) {
                const img = document.createElement('img');
                img.src = `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(apartamento.imageUrl)}`;
                img.alt = "Imagem atual";
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.display = 'block';
                img.style.marginBottom = '5px';
                currentImagePreview.appendChild(img);
                
                const urlText = document.createElement('p');
                urlText.textContent = `URL Original: ${apartamento.imageUrl.substring(0, 50)}...`;
                currentImagePreview.appendChild(urlText);
            } else {
                currentImagePreview.textContent = 'Nenhuma imagem atual.';
            }

        } catch (erro) {
            console.error("Erro ao preencher formulário de edição:", erro);
        }
    }

    // FUNÇÃO PARA ENVIAR DADOS ATUALIZADOS (PUT) 
    async function atualizarApartamento(event) {
        event.preventDefault();

        const id = document.getElementById('editId').value;
        const titulo = document.getElementById('editTitulo').value;
        const preco = parseFloat(document.getElementById('editPreco').value);
        const rua = document.getElementById('editRua').value;
        const imageUrl = document.getElementById('editImageUrl').value;

        if (isNaN(preco)) {
            alert('Preço Inválido');
            return;
        }
        if (!id) {
            alert('ID do imóvel não encontrado');
            return;
        }

        const apartamento = {
            titulo,
            preco,
            endereco: { rua },
            imageUrl: imageUrl || null
        };

        try {
            const resposta = await fetch(`${API_BASE_URL}/apartamentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apartamento)
            });

            if (!resposta.ok) {
                const errorData = await resposta.json();
                throw new Error(`Erro ao atualizar imóvel: ${errorData.error || resposta.statusText}`);
            }

            alert('Imóvel atualizado com sucesso!');
            document.getElementById('modalEdicao').style.display = 'none';
            window.location.reload(); 
        } catch (erro) {
            console.error("Erro ao atualizar imóvel:", erro);
            alert(erro.message);
        }
    }

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modalEdicao').style.display = 'none';
    });

    document.getElementById('formEdicao').addEventListener('submit', atualizarApartamento);
});