// Modules
import fs from 'fs';
import express from 'express';
import Sauce from '../models/sauce';
import midMulter from '../middlewares/midMulter';
import { auth, isOwner } from '../middlewares/auth';

// Création du routeur
const router = express.Router();

// Get list of sauces
router.get("/", auth, async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (err) {
        res.status(500).json({ err });
    }
});

// Get a single sauce
router.get("/:id", auth, async (req, res, next) => {
    try {
        // Check if sauce exists
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

// Create new sauce
router.post("/", auth, midMulter, async (req, res, next) => {
    try {
        if (req.body.sauce) {
            // Create and save sauce data
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

// Update existing sauce: this route can receive either the sauce data in req.body or two parameters if
// an image was sent
router.put("/:id", auth, midMulter, async (req, res, next) => {
    try {
        let newData;
        if (req.body.sauce) {
            // Get sauce from a parameter is an image was sent
            newData = JSON.parse(req.body.sauce);
        } else {
            // Get sauce from req.body if no new image was sent
            newData = req.body;
        }

        // Check if the sauce was created by the user
        const checkOwnership = isOwner(req, res, newData.userId);
        if (checkOwnership === false) {
            res.status(403).json({ message: "Pas autorisé à effectuer cette action." });
        } else {
            // If a new image was uploaded
            if (req.file) {
                // Get sauce data
                const oldData = await Sauce.findOne({ _id: req.params.id });
                // Delete previous image file from the server
                fs.unlink(`images/${oldData.imageUrl.split('/images/')[1]}`, (err) => {
                    if (err) throw err;
                });
                // Replace image path by the new one
                newData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }
            // Save new data
            await Sauce.updateOne({ _id: req.params.id }, newData);
            res.status(200).json({ message: 'Sauce mise à jour.' });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});

// Delete sauce
router.delete("/:id", auth, async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce) {
            // Check if the sauce was created by the user
            const checkOwnership = isOwner(req, res, sauce.userId);
            if (checkOwnership === false) {
                res.status(403).json({ message: "Pas autorisé à effectuer cette action." });
            } else {
                // Delete the image first
                fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, async (err) => {
                    if (err) throw err;
                    // Then delete the sauce
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

// Like/dislike a sauce
router.post("/:id/like", auth, async (req, res, next) => {
    try {
        if (req.body.userId && [-1, 0, 1].includes(req.body.like)) {
            const sauce = await Sauce.findOne({ _id: req.params.id });

            // Remove the sauce's ID from both usersLiked & usersDisliked lists
            sauce.usersLiked = sauce.usersLiked.filter(id => id != req.body.userId);
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id != req.body.userId);

            switch (req.body.like) {
                // If the sauce was liked, add it to the list
                case 1:
                    sauce.usersLiked.push(req.body.userId);
                    break;
                // If the sauce was disliked, add it to the list
                case -1:
                    sauce.usersDisliked.push(req.body.userId);
                    break;
                default:
                    break;
            }
            // Update likes and dislikes count
            sauce.likes = sauce.usersLiked.length;
            sauce.dislikes = sauce.usersDisliked.length;
            // Update sauce object
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
