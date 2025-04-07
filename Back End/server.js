const fastify = require('fastify')({ logger: true });
require('dotenv').config();
const admin = require('./firebase');
const userRoutes = require('./routes/user');
const apartamentosRoutes = require('./routes/apartamentos');
const cors = require('@fastify/cors');

fastify.register(cors, {
    origin: '*', // Permite todas as origens (para teste)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Garanta que OPTIONS e DELETE estejam aqui
});

fastify.register(apartamentosRoutes, { prefix: '/apartamentos' });
fastify.register(userRoutes, { prefix: '/users' });

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