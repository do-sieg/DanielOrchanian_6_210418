// Modules
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import sauceRouter from './routes/sauces';

// Environment variables
dotenv.config();

// Database connection
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.18ayp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(() => console.log('Failed connecting to MongoDB.'));

// Set up express server
const app = express();

app.use(bodyParser.json());

// CORS permissions
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Manage static requests for the /images route
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/sauces', sauceRouter);

// Port listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));
