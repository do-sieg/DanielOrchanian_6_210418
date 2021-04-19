// Modules
import fs from 'fs';
import express from 'express';
import Sauce from '../models/sauce';
import midMulter from '../middlewares/midMulter';
import { auth, isOwner } from '../middlewares/auth';

// Création du routeur
const router = express.Router();


router.get("/", auth, async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (err) {
        res.status(500).json({ err });
    }
});


router.get("/:id", auth, async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce) {
            res.status(200).json(sauce);
        } else {
            res.status(404).json({ message: "Sauce introuvable." });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});


router.post("/", auth, midMulter, async (req, res, next) => {
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


router.put("/:id", auth, midMulter, async (req, res, next) => {
    try {
        let newData;
        if (req.body.sauce) {
            newData = JSON.parse(req.body.sauce);
        } else {
            newData = req.body;
        }

        const checkOwnership = isOwner(req, res, newData.userId);
        if (checkOwnership === false) {
            res.status(403).json({ message: "Pas autorisé à effectuer cette action." });
        } else {
            if (req.file) {
                const oldData = await Sauce.findOne({ _id: req.params.id });
                fs.unlink(`images/${oldData.imageUrl.split('/images/')[1]}`, (err) => {
                    if (err) throw err;
                });
                newData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }

            await Sauce.updateOne({ _id: req.params.id }, newData);
            res.status(200).json({ message: 'Sauce mise à jour.' });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});


router.delete("/:id", auth, async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce) {
            const checkOwnership = isOwner(req, res, sauce.userId);
            if (checkOwnership === false) {
                res.status(403).json({ message: "Pas autorisé à effectuer cette action." });
            } else {
                fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, async (err) => {
                    if (err) throw err;

                    await Sauce.deleteOne({ _id: req.params.id });
                    res.status(200).json({ message: 'Sauce supprimée.' })
                });
            }

        } else {
            res.status(404).json({ message: "Sauce introuvable." });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});


router.post("/:id/like", auth, async (req, res, next) => {
    try {
        if (req.body.userId && [-1, 0, 1].includes(req.body.like)) {
            const sauce = await Sauce.findOne({ _id: req.params.id });

            sauce.usersLiked = sauce.usersLiked.filter(id => id != req.body.userId);
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id != req.body.userId);

            switch (req.body.like) {
                case 1:
                    sauce.usersLiked.push(req.body.userId);
                    break;
                case -1:
                    sauce.usersDisliked.push(req.body.userId);
                    break;
                default:
                    break;
            }

            sauce.likes = sauce.usersLiked.length;
            sauce.dislikes = sauce.usersDisliked.length;

            await Sauce.updateOne({ _id: sauce._id }, sauce);

            res.status(200).json({ message: 'Sauce likée.' });

        } else {
            res.status(400).json({ message: "Paramètres manquants ou invalides." });
        }

    } catch (err) {
        res.status(500).json({ err });
    }
});

export default router;
