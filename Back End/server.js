const fastify = require('fastify')({ logger: true });
require('dotenv').config();
const admin = require('./firebase');
const userRoutes = require('./routes/user');
const apartamentosRoutes = require('./routes/apartamentos');
const cors = require('@fastify/cors');
const path = require('path');

// Importa a nova rota de proxy de imagem
const imageProxyRoutes = require('./routes/imageProxy'); // <-- Adicione esta linha

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Registra a rota de apartamentos
fastify.register(apartamentosRoutes, { prefix: '/apartamentos' });
// Registra a rota de usuários
fastify.register(userRoutes, { prefix: '/users' });
// Registra a nova rota de proxy, o endpoint será /proxy-image
fastify.register(imageProxyRoutes, { prefix: '/proxy-image' }); // <-- Adicione esta linha

// Configuração para servir arquivos estáticos do frontend (HTML, CSS, JS, etc.)
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../Front End'), // Aponta para sua pasta 'Front End'
    prefix: '/', // Isso fará com que 'http://localhost:3000/index.html' funcione,
                  // e imagens como '/assets/...' sejam carregadas
});

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000 });
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();