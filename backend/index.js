// backend/index.js --- FINALE VERSION MIT ECHTER DATENBANK-LOGIK ---
const User = require('./models/user.model.js');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js'); // Wichtig: Unser Produkt-Modell importieren

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json()); 

const DB_CONNECTION_STRING = "mongodb+srv://grxnki:12345@cluster0.fe0vfsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0DEIN_VOLLSTÄNDIGER_CONNECTION_STRING"; // Hier steht dein String drin

// --- Seeding-Funktion ---
// Diese Funktion prüft, ob Produkte in der DB sind und fügt sie ggf. hinzu.
async function seedDatabase() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('ℹ️ Keine Produkte in der DB gefunden, fülle sie mit Beispieldaten...');
      const sampleProducts = [
        { name: 'Eco-Friendly Wasserflasche', description: 'Wiederverwendbare Wasserflasche aus nachhaltigen Materialien.', price: 15.99, imageUrl: '' },
        { name: 'Solar-Powerbank', description: 'Lade deine Geräte unterwegs mit der Kraft der Sonne.', price: 39.99, imageUrl: '' },
        { name: 'Bambus-Zahnbürsten (4er-Pack)', description: 'Eine umweltfreundliche Alternative zu Plastikzahnbürsten.', price: 9.99, imageUrl: '' }
      ];
      await Product.insertMany(sampleProducts);
      console.log('✅ Beispieldaten erfolgreich in die DB eingefügt!');
    } else {
      console.log('ℹ️ Datenbank enthält bereits Produkte, Seeding wird übersprungen.');
    }
  } catch (error) {
    console.error('❌ Fehler beim Seeding der Datenbank:', error);
  }
}

// --- Datenbank-Verbindung & Server-Start ---
mongoose.connect(DB_CONNECTION_STRING)
  // NEUE ROUTE: Benutzer registrieren
app.post('/api/users/register', async (req, res) => {
  try {
    // 1. Daten aus der Anfrage holen
    const { email, password } = req.body;

    // 2. Prüfen, ob der Benutzer schon existiert
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // 400 = Bad Request (fehlerhafte Anfrage)
      return res.status(400).json({ message: 'Ein Benutzer mit dieser E-Mail existiert bereits.' });
    }

    // 3. Das Passwort hashen
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Neuen Benutzer erstellen
    const newUser = new User({
      email: email,
      password: hashedPassword // Das gehashte Passwort speichern!
    });

    // 5. Benutzer in der Datenbank speichern
    await newUser.save();

    // 6. Erfolgsmeldung zurücksenden
    // 201 = Created (erfolgreich erstellt)
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });

  } catch (error) {
    res.status(500).json({ message: 'Server-Fehler bei der Registrierung.', error: error });
  }
});
  .then(async () => { // "async" hinzugefügt, damit wir "await" benutzen können
    console.log('✅ Erfolgreich mit der MongoDB-Datenbank verbunden!');
    
    await seedDatabase(); // Wir rufen die Seeding-Funktion nach der Verbindung auf
    
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Fehler bei der Verbindung zur Datenbank:', err);
    process.exit(1);
  });

// --- API-ROUTEN (JETZT MIT DATENBANK-LOGIK) ---

// LÖSCHE ODER KOMMENTIERE DAS ALTE "products"-ARRAY AUS. WIR BRAUCHEN ES NICHT MEHR.

// Route für ALLE Produkte (jetzt aus der DB)
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await Product.find({}); // .find({}) holt alle Dokumente
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' });
  }
});

// Route für EIN Produkt (jetzt aus der DB)
app.get('/api/products/:id', async (req, res) => {
  try {
    // .findById() ist eine Mongoose-Funktion, die nach der einzigartigen _id sucht
    const product = await Product.findById(req.params.id); 
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Produkts' });
  }
});