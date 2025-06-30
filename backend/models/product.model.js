// models/product.model.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Wir definieren die Felder und ihre Datentypen.
  // Mongoose fügt automatisch eine einzigartige _id zu jedem Produkt hinzu.
  name: {
    type: String,
    required: true // Dieses Feld ist ein Pflichtfeld.
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Der Preis kann nicht negativ sein.
  },
  imageUrl: {
    type: String,
    required: false // Ein Bild ist optional.
  }
});

// Erstelle das "Product"-Modell aus dem Schema.
// Mongoose erstellt daraus automatisch eine Collection namens "products" (in Kleinschreibung und Mehrzahl).
const Product = mongoose.model('Product', productSchema);

// Exportiere das Modell, damit wir es in anderen Dateien benutzen können.
module.exports = Product;