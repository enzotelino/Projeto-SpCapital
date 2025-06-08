const fetch = require('node-fetch'); // Importa a biblioteca node-fetch

async function imageProxyRoutes(fastify, options) {

    // Rota GET para o proxy de imagem
    // Ela vai receber a URL da imagem externa como um parâmetro de query (ex: /proxy-image?url=...)
    fastify.get('/', async (request, reply) => {
        const { url } = request.query; // Pega o valor do parâmetro 'url' da requisição

        // Verifica se a URL da imagem foi fornecida
        if (!url) {
            return reply.status(400).send({ error: 'O parâmetro "url" é obrigatório.' });
        }

        try {
            // Faz uma requisição HTTP para a URL da imagem externa
            const response = await fetch(url);

            // Se a requisição à imagem externa não for bem-sucedida (status 4xx ou 5xx)
            if (!response.ok) {
                console.error(`Falha ao buscar imagem da URL: ${url}. Status: ${response.status} ${response.statusText}`);
                return reply.status(response.status).send({ error: `Falha ao buscar imagem: ${response.statusText}` });
            }

            // Pega o Content-Type da resposta da imagem externa
            // Isso é crucial para que o navegador saiba que tipo de arquivo está recebendo (image/jpeg, image/png, etc.)
            const contentType = response.headers.get('Content-Type');

            // Define o Content-Type da sua resposta Fastify para o mesmo da imagem
            if (contentType) {
                reply.header('Content-Type', contentType);
            } else {
                // Caso não haja Content-Type, define um padrão genérico para evitar problemas
                reply.header('Content-Type', 'application/octet-stream');
            }
            
            // Envia o stream do corpo da imagem diretamente para o cliente
            // O Fastify lida bem com streams, então não precisa carregar tudo na memória
            return reply.send(response.body); 
            
        } catch (error) {
            // Captura qualquer erro que aconteça durante o processo de proxy
            console.error('Erro interno no proxy de imagem:', error);
            reply.status(500).send({ error: 'Erro interno no proxy de imagem.' });
        }
    });
}

module.exports = imageProxyRoutes;