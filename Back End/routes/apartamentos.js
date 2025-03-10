const admin = require('../firebase');

async function apartamentosRoutes(fastify, options) {
    const db = admin.firestore();
    const apartamentosCollection = db.collection('apartamentos');

    fastify.post('/', async (request, reply) => {
        const { titulo, preco, endereco } = request.body;
        const criadoEm = admin.firestore.FieldValue.serverTimestamp();
        const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

        if (preco === undefined) {
            reply.status(400).send({ error: 'O campo "preco" é obrigatório.' });
            return;
        }

        const docRef = await apartamentosCollection.add({
            titulo,
            valor: preco, // Use o valor recebido
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
            const {valor, endereco } = request.body;
            const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
            await apartamentosCollection.doc(id).update({ valor, endereco, atualizadoEm });
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
    }

    module.exports = apartamentosRoutes;