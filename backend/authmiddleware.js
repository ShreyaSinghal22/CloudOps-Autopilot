import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
    // 1. Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token using your secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Ensure the user has the admin role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }

        // Attach user info to the request and proceed
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
};