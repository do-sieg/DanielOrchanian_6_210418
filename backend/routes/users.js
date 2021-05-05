// Modules
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { isValidEmail, isValidPassword } from '../utils/validation';
import md5 from 'md5';

// Create router
const router = express.Router();

// Validate parameters
function validateAuthParams(req, res, next) {
    // Check if required parameters are sent
    if (req.body.password && req.body.password !== "" && req.body.email && req.body.email !== "") {
        // Check if password is valid
        if (!isValidPassword(req.body.password)) {
            res.status(400).json({ message: "Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)." });
        // Check if email is valid
        } else if (!isValidEmail(req.body.email)) {
            res.status(400).json({ message: "Paramètres manquants ou invalides." });
        } else {
            next();
        }
    } else {
        res.status(400).json({ message: "Paramètres manquants ou invalides." });
    }
}

// Signup route
router.post("/signup", validateAuthParams, async (req, res, next) => {
    try {
        // Encrypt password
        const hashEmail = md5(req.body.email);
        const hashPass = await bcrypt.hashSync(req.body.password, 10);
        // Create new user
        const user = new User({
            email: hashEmail,
            password: hashPass,
        });
        // Save user
        await user.save();
        res.status(201).json({ message: "Utilisateur enregistré." });
    } catch (err) {
        res.status(500).json({ err });
    }
});

// Login route
router.post("/login", validateAuthParams, async (req, res, next) => {
    try {
        // Find user with email
        const hashEmail = md5(req.body.email);
        const user = await User.findOne({ email: hashEmail });
        // If user exists
        if (user !== null) {
            // Compare passwords
            const validPass = await bcrypt.compareSync(req.body.password, user.password);
            // If the passwords match
            if (validPass === true) {
                // Send user ID and token
                const payload = {
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '24h' })
                };
                res.status(200).json(payload);
                // If the passwords don't match
            } else {
                res.status(401).json({ message: 'Mot de passe incorrect.' });
            }
            // If user doesn't exist
        } else {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ err });
    }
});


export default router;

