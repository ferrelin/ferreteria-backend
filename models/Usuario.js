const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema del Usuario
const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware para cifrar la contraseña antes de guardar el usuario
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Si no se modifica la contraseña, pasa a la siguiente
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);
