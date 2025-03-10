const admin = require('firebase-admin');
const serviceAccount = require('./imobiliaria-2046b-firebase-adminsdk-fbsvc-a58883b91e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;