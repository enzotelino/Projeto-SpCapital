const admin = require('../firebase');

async function apartamentosRoutes(fastify, options) {
    const db = admin.firestore();
    const apartamentosCollection = db.collection('apartamentos');

    // Adicionar apartamento
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
            preco,
            endereco,
            criadoEm,
            atualizadoEm
        });

        reply.send({ id: docRef.id });
    });

    // Buscar todos os apartamentos
    fastify.get('/', async (request, reply) => {
        const snapshot = await apartamentosCollection.get();
        const apartamentos = [];
        snapshot.forEach(doc => {
            apartamentos.push({ id: doc.id, ...doc.data() });
        });
        reply.send(apartamentos);
    });

    // Buscar apartamento por ID (corrige o erro 404)
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const doc = await apartamentosCollection.doc(id).get();
            if (!doc.exists) {
                return reply.status(404).send({ error: 'Apartamento não encontrado' });
            }
            reply.send({ id: doc.id, ...doc.data() });
        } catch (error) {
            console.error('Erro ao buscar apartamento por ID:', error);
            reply.status(500).send({ error: 'Erro interno ao buscar apartamento' });
        }
    });

    // Atualizar apartamento (corrige erro 500)
    fastify.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const { preco, endereco, titulo } = request.body;
        const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

        await apartamentosCollection.doc(id).update({
            titulo,
            preco,
            endereco,
            atualizadoEm
        });

        reply.send({ message: 'Apartamento atualizado com sucesso' });
    });

    // Remover apartamento
    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await apartamentosCollection.doc(id).delete();
            reply.send({ message: 'Apartamento removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover apartamento:', error);
            reply.status(500).send({ error: 'Erro ao remover apartamento' });
        }
    });
}

module.exports = apartamentosRoutes;
