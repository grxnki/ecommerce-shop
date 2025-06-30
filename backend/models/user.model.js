// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Jede E-Mail-Adresse darf nur einmal existieren
    lowercase: true, // Speichert E-Mails immer in Kleinbuchstaben
    trim: true // Entfernt Leerzeichen am Anfang und Ende
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;