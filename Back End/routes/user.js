const admin = require('../firebase'); // Importa Firebase

    async function userRoutes(fastify, options) {
        fastify.get('/', async (request, reply) => { // Rota GET
            const users = await admin.firestore().collection('users').get();
            const usersData = users.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            reply.send(usersData);
        });

        fastify.post('/', async (request, reply) => { // Rota POST
            const { name, email } = request.body;
            const docRef = await admin.firestore().collection('users').add({ name, email });
            reply.send({ id: docRef.id, name, email });
        });
    }

    module.exports = userRoutes;