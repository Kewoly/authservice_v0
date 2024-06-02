const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongoose').Types.ObjectId


const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  dateOfBirth: Date,
  phoneNumber: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema,"users");

module.exports = User;