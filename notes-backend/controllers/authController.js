const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ganti 'secretkey' dengan secret dari .env nanti
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        const lastUser = await User.findOne().sort({ customId: -1 });
        const customId = lastUser ? lastUser.customId + 1 : 1;

        const newUser = new User({
            customId,
            name,
            email,
            password, // ⬅️ tidak di-hash manual di sini
        });

        await newUser.save();

        res.status(201).json({ message: 'Registrasi berhasil', data: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Gagal registrasi', error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const passwordMatch = await user.matchPassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.customId,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal login', error: error.message });
    }
};


module.exports = { register, login };
