import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check against the hardcoded .env credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Issue a token valid for 12 hours
        const token = jwt.sign(
            { role: 'admin', user: username },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        return res.json({ token, message: 'Authentication successful' });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;