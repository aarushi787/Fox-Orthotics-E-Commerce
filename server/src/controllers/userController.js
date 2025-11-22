const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password; // Never send password
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUserProfile = async (req, res, next) => {
    try {
        // Ensure user can only update their own profile (unless they are an admin)
        if (String(req.user.id) !== String(req.params.id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        // Prevent password updates through this endpoint
        const { password, ...updateData } = req.body;

        const affectedRows = await User.update(req.params.id, updateData);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findById(req.params.id);
        delete updatedUser.password;
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};
