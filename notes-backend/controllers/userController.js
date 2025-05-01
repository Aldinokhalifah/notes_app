const User = require('../models/User');
const bcrypt = require('bcryptjs');

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // dari middleware auth
        const { name, email, password, oldPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Update name dan email jika diberikan
        if (name) user.name = name;
        if (email) user.email = email;

        // Jika user ingin ubah password
        if (password) {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Password lama harus diberikan untuk mengubah password' });
            }

            const isMatch = await user.matchPassword(oldPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Password lama salah' });
            }

            user.password = password; // akan di-hash oleh pre('save')
        }

        await user.save();

        res.status(200).json({
            message: 'Profil berhasil diperbarui',
            data: {
                id: user.customId,
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui profil',
            error: error.message,
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.status(200).json({
            id: user.customId,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data profil',
            error: error.message,
        });
    }
};


module.exports = { updateUserProfile, getUserProfile };