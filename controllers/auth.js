const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, phoneNumber } = req.body

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Trouver le rôle par défaut
    const role = await Role.findOne({ IsAdmin: false }); 
    console.log('Default Role:', role);
    if (!role) return res.status(500).json({ msg: 'Default role not found' });

    // Créez un nouvel utilisateur avec le rôle par défaut
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      role: role._id // Utilisez l'ID du rôle par défaut
    });

    await newUser.save();

    // Créez un token JWT avec le rôle par défaut
    const payload = { userId: newUser._id, role: role.IsAdmin };
    //constaccess_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2700s' });

    res.status(201).json({ message: "User registered in Successfully"});
  } catch (err) {
    console.error(err); // Ajoutez ce log pour vérifier les erreurs du serveur
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('role');
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id, role: user.role.IsAdmin };
    const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.status(200).json({ refresh_token });
  } catch (err) {
    console.error(err); // Ajoutez ce log pour vérifier les erreurs du serveur
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;