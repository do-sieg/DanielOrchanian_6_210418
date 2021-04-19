// Modules
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { isValidEmail } from '../utils/validation';

// Création du routeur
const router = express.Router();


function validateAuthParams(req, res, next) {
    if (req.body.password && req.body.password !== "" && req.body.email && req.body.email !== "") {
        if (isValidEmail(req.body.email)) {
            next();
        } else {
            res.status(400).json({ message: "Paramètres manquants ou invalides." });
        }
    } else {
        res.status(400).json({ message: "Paramètres manquants ou invalides." });
    }
}


router.post("/signup", validateAuthParams, async (req, res, next) => {
    try {
        const hash = await bcrypt.hashSync(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        await user.save();
        res.status(201).json({ message: "Utilisateur enregistré." });
    } catch (err) {
        res.status(500).json({ err });
    }
});


router.post("/login", validateAuthParams, async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user !== null) {
            const validPass = await bcrypt.compareSync(req.body.password, user.password);
            if (validPass === true) {
                const payload = {
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '24h' })
                };
                res.status(200).json(payload);
            } else {
                res.status(401).json({ message: 'Mot de passe incorrect.' });
            }
        } else {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});


export default router;

