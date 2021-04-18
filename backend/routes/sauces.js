// Modules
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Sauce from '../models/sauce';
import { isValidEmail } from '../utils/validation';
import midMulter from '../middlewares/midMulter';

// Création du routeur
const router = express.Router();


// NEED AUTH
router.get("/", async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (err) {
        res.status(500).json({ err });
    }
});

// NEED AUTH
router.post("/", midMulter, async (req, res, next) => {
    try {
        if (req.body.sauce) {
            const obj = JSON.parse(req.body.sauce);
            const sauce = new Sauce(Object.assign(
                obj,
                { imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` },
            ));
            await sauce.save();
            res.status(201).json({ message: 'Sauce enregistrée.' });
        } else {
            res.status(400).json({ message: "Paramètres manquants ou invalides." });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});

export default router;

