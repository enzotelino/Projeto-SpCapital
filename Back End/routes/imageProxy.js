const fetch = require('node-fetch'); 

async function imageProxyRoutes(fastify, options) {

    
    fastify.get('/', async (request, reply) => {
        const { url } = request.query; 

        if (!url) {
            return reply.status(400).send({ error: 'O parâmetro "url" é obrigatório.' });
        }

        try {
            
            const response = await fetch(url);

            
            if (!response.ok) {
                console.error(`Falha ao buscar imagem da URL: ${url}. Status: ${response.status} ${response.statusText}`);
                return reply.status(response.status).send({ error: `Falha ao buscar imagem: ${response.statusText}` });
            }

            
            const contentType = response.headers.get('Content-Type');

            if (contentType) {
                reply.header('Content-Type', contentType);
            } else {
                
                reply.header('Content-Type', 'application/octet-stream');
            }
            
            
            return reply.send(response.body); 
            
        } catch (error) {
            // Captura qualquer erro que aconteça durante o processo de proxy
            console.error('Erro interno no proxy de imagem:', error);
            reply.status(500).send({ error: 'Erro interno no proxy de imagem.' });
        }
    });
}

module.exports = imageProxyRoutes;