// Modules
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './router';

// Connection à la base de données
mongoose.connect('mongodb+srv://admin-1:test-fghjkl@cluster0.18ayp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Mise en place du serveur
const app = express();

app.use(bodyParser.json());

// Permissions du CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(router);

// Écoute du port
const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
