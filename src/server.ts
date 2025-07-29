import express from 'express';
import router from './routes/auth';
import db from './database/connection';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );
    next();
});

app.get('/users', (req, res) => {
    try {
        const users = db.prepare('SELECT * FROM User').all(); // Synchrone
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

app.use('/api', router);

export default app