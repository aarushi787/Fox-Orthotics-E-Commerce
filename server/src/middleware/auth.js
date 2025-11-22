const jwt = require('jsonwebtoken');
const firebaseAdmin = require('../config/firebase');
const User = require('../models/User');

// Helper: check email against admin list env var
function isEmailAdmin(email) {
    const list = process.env.FIREBASE_ADMIN_EMAILS || '';
    if (!list) return false;
    return list.split(',').map(s => s.trim().toLowerCase()).includes((email || '').toLowerCase());
}

const auth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Authentication token required.' });
            }

            const token = authHeader.split(' ')[1];

            // Try local JWT first
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(String(decoded.id));
                if (!user) return res.status(401).json({ message: 'User not found.' });
                if (roles.length && !roles.includes(user.role)) {
                    return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
                }
                req.user = { id: user.id, email: user.email, role: user.role };
                return next();
            } catch (err) {
                // not a local JWT - fall through to try Firebase ID token
            }

            // Try Firebase ID token (if firebaseAdmin initialized)
            if (firebaseAdmin && firebaseAdmin.auth) {
                try {
                    const decodedFirebase = await firebaseAdmin.auth().verifyIdToken(token);
                    const email = decodedFirebase.email;
                    // Check Firestore for user role
                    let user = await User.findByEmail(email);
                    if (!user) {
                        // Create a user record for the Firebase user with customer role
                        const id = await User.create({ email, firstName: decodedFirebase.name || '', lastName: '', role: 'customer' });
                        user = await User.findById(id);
                    }

                    if (isEmailAdmin(email)) {
                        user.role = 'admin';
                        // persist role change
                        await User.update(user.id, { role: 'admin' });
                    }

                    if (roles.length && !roles.includes(user.role)) {
                        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
                    }

                    req.user = { id: user.id, email: user.email, role: user.role };
                    return next();
                } catch (fbErr) {
                    return res.status(401).json({ message: 'Invalid or expired token.' });
                }
            }

            return res.status(401).json({ message: 'Authentication token required.' });

        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                 return res.status(401).json({ message: 'Invalid or expired token.' });
            }
            next(error);
        }
    };
};

module.exports = auth;
