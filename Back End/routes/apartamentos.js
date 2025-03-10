const admin = require('../firebase');

async function apartamentosRoutes(fastify, options) {
    const db = admin.firestore();
    const apartamentosCollection = db.collection('apartamentos');

    fastify.post('/', async (request, reply) => {
        const { titulo, preco, fotos, endereco } = request.body;
        const criadoEm = admin.firestore.FieldValue.serverTimestamp();
        const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

        if (preco === undefined) {
            reply.status(400).send({ error: 'O campo "preco" é obrigatório.' });
            return;
        }

        const docRef = await apartamentosCollection.add({
            titulo,
            valor: preco, // Use o valor recebido
            fotos,
            endereco,
            criadoEm,
            atualizadoEm
        });

        reply.send({ id: docRef.id });
    });

        fastify.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await apartamentosCollection.doc(id).delete();
            reply.send({ message: 'Anúncio removido com sucesso' });
        });

        fastify.put('/:id', async (request, reply) => {
            const { id } = request.params;
            const { fotos, valor, endereco } = request.body;
            const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
            await apartamentosCollection.doc(id).update({ fotos, valor, endereco, atualizadoEm });
            reply.send({ message: 'Anúncio atualizado com sucesso' });
        });

        fastify.get('/', async (request, reply) => {
            const snapshot = await apartamentosCollection.get();
            const apartamentos = [];
            snapshot.forEach(doc => {
                apartamentos.push({ id: doc.id, ...doc.data() });
            });
            reply.send(apartamentos);
        });

        // Rota para obter um imóvel por ID
        fastify.get('/apartamentos/:id', async (request, reply) => {
             const { id } = request.params;
                const apartamento = apartamentos.find(a => a.id === parseInt(id));
             if (!apartamento) {
                return reply.status(404).send({ message: 'Apartamento não encontrado' });
             }
        reply.send(apartamento);
        });
        
        // Rota para atualizar um imóvel

    fastify.put('/apartamentos/:id', async (request, reply) => {
        const { id } = request.params;
        const { titulo, preco, fotos, rua } = request.body;
        const apartamentoIndex = apartamentos.findIndex(a => a.id === parseInt(id));
        if (apartamentoIndex === -1) {
            return reply.status(404).send({ message: 'Apartamento não encontrado' });
    }
    apartamentos[apartamentoIndex] = {
        id: parseInt(id),
        titulo,
        preco,
        fotos,
        endereco: { rua }
    };
    reply.send(apartamentos[apartamentoIndex]);
});
    }

    module.exports = apartamentosRoutes;