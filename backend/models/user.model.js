// models/user.model.js --- DIE FINALE KORREKTUR ---

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // DIESES FELD HAT IN DEINER DATEI GEFEHLT
  role: {
    type: String,
    enum: ['user', 'admin'], // Erlaubt nur diese beiden Werte
    default: 'user'         // Standardwert für neue Benutzer
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;