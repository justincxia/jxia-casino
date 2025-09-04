const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const config = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                gamesPlayed: user.gamesPlayed,
                totalWinnings: user.totalWinnings
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                gamesPlayed: user.gamesPlayed,
                totalWinnings: user.totalWinnings
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                gamesPlayed: user.gamesPlayed,
                totalWinnings: user.totalWinnings
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/coins', auth, async (req, res) => {
    try {
        const { coins } = req.body;

        if (typeof coins !== 'number' || coins < 0) {
            return res.status(400).json({ message: 'Invalid coins amount' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { coins },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Coins updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                gamesPlayed: user.gamesPlayed,
                totalWinnings: user.totalWinnings
            }
        });
    } catch (error) {
        console.error('Update coins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/topup', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newCoins = Math.max(user.coins, 100);

        user.coins = newCoins;
        await user.save();

        res.json({
            message: 'Coins topped up successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                gamesPlayed: user.gamesPlayed,
                totalWinnings: user.totalWinnings
            }
        });
    } catch (error) {
        console.error('Top up error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/debug/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Debug users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;