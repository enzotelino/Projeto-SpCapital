const { parse } = require('yargs');
const admin = require('../firebase');

async function apartamentosRoutes(fastify, options) {
    const db = admin.firestore();
    const apartamentosCollection = db.collection('apartamentos');

    // Adicionar apartamento
    fastify.post('/', async (request, reply) => {
        const { titulo, preco, endereco, imageUrl } = request.body;
        const criadoEm = admin.firestore.FieldValue.serverTimestamp();
        const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

        if (preco === undefined || isNaN(parseFloat(preco))) {
            reply.status(400).send({ error: 'O campo "preco" é obrigatório.' });
            return;
        }

        const docRef = await apartamentosCollection.add({
            titulo,
            preco: parseFloat(preco),
            endereco,
            imageUrl: imageUrl || null, 
            criadoEm,
            atualizadoEm
        });

        reply.send({ id: docRef.id, imageUrl });
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

    // Buscar apartamento por ID 
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

    // Atualizar apartamento 
    fastify.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const { titulo, preco, endereco, imageUrl} = request.body;
        const atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

        let updateData = {
            titulo,
            preco: parseFloat(preco),
            endereco,
            imageUrl: imageUrl || null,
            atualizadoEm
        };
        
        try {
            await apartamentosCollection.doc(id).update(updateData);
            reply.send({message: 'Apartamento atualizado com sucesso', imageUrl: updateData.imageUrl});
        } catch (error) {
            console.error('Erro ao atualizar apartamento:', error);
            reply.status(500).send({error: 'Erro interno ao atualizar apartamento.'});
        }
    });

    // Remover apartamento
    fastify.delete('/:id', async (request, reply) => {
  const { id } = request.params;
        try {
            const docRef = apartamentosCollection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return reply.status(404).send({ message: 'Apartamento não encontrado.' });
            }
            
            await docRef.delete();
            reply.send({ message: 'Apartamento removido com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover apartamento:', error);
            reply.status(500).send({ error: 'Erro ao remover apartamento.' });
        }
    });
}

module.exports = apartamentosRoutes;
