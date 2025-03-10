const fastify = require('fastify')({ logger: true }); // Cria instância Fastify
    require('dotenv').config(); // Carrega variáveis de ambiente
    const admin = require('./firebase'); // Inicializa Firebase
    const userRoutes = require('./routes/user'); // Carrega rotas
    const apartamentosRoutes = require('./routes/apartamentos');
    const cors = require('@fastify/cors')

    fastify.register(cors, {
        origin: '*' // Permite todas as origens (para teste)
    });
    
    
    fastify.register(apartamentosRoutes, { prefix: '/apartamentos' });

    fastify.register(userRoutes, { prefix: '/users' }); // Registra rotas

    const start = async () => { // Inicia o servidor
        try {
            await fastify.listen({ port: process.env.PORT || 3000 });
            fastify.log.info(`server listening on ${fastify.server.address().port}`);
        } catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    };

    start();