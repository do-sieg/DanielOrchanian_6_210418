// Modules
import express from 'express';
import router from './router';

// Mise en place du serveur
const app = express();

// Écoute du port
const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(router);