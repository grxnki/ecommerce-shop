// models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Wir speichern eine Referenz auf den Benutzer, der die Bestellung aufgegeben hat.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Wir speichern eine Kopie der Produkte direkt in der Bestellung.
  products: [Object],
  // Wir speichern den Gesamtpreis.
  totalPrice: {
    type: Number,
    required: true
  },
  // Wir fügen automatisch das Bestelldatum hinzu.
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;