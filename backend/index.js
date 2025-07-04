// backend/index.js --- KORREKTE REIHENFOLGE ---
const Order = require('./models/order.model.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('./models/product.model.js');
const User = require('./models/user.model.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Willkommens-Route für die Startseite der API
app.get('/', (req, res) => {
  res.json({ message: "Willkommen bei der E-Commerce API! Der Server läuft." });
});

const DB_CONNECTION_STRING = "mongodb+srv://grxnki:12345@cluster0.fe0vfsa.mongodb.net/shop-db?retryWrites=true&w=majority&appName=Cluster0EIN_VOLLSTÄNDIGER_CONNECTION_STRING"; // Hier steht dein String

// --- API-ROUTEN ---
// Alle Routen kommen hierhin, VOR die Datenbank-Verbindung.

// Route für ALLE Produkte
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' });
  }
});

// Route für EIN Produkt
app.get('/api/products/:id', async (req, res) => {
  try {
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

// Route für Benutzer-Registrierung
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Ein Benutzer mit dieser E-Mail existiert bereits.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
  } catch (error) {
    res.status(500).json({ message: 'Server-Fehler bei der Registrierung.', error: error });
  }
});

// NEUE ROUTE: Benutzer einloggen
app.post('/api/users/login', async (req, res) => {
  try {
    // 1. Daten aus der Anfrage holen
    const { email, password } = req.body;

    // 2. Benutzer in der DB suchen
    const user = await User.findOne({ email: email });
    if (!user) {
      // Wichtig: Keine spezifische Fehlermeldung geben ("Benutzer nicht gefunden"),
      // um Angreifern keine Hinweise zu liefern.
      return res.status(400).json({ message: 'E-Mail oder Passwort ist falsch.' });
    }

    // 3. Eingegebenes Passwort mit dem Hash in der DB vergleichen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-Mail oder Passwort ist falsch.' });
    }

    // 4. Wenn alles passt, einen JWT erstellen (Payload)
    const payload = {
      user: {
        id: user.id // Die ID des Benutzers in den Token packen
      }
    };

    // 5. Den Token mit unserem geheimen Schlüssel signieren
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Holt den Secret Key aus der .env-Datei
      { expiresIn: '1h' }, // Der Token ist 1 Stunde gültig
      (err, token) => {
        if (err) throw err;
        // 6. Den Token an den Client zurücksenden
        res.json({ token });
      }
    );

  } catch (error) {
    res.status(500).json({ message: 'Server-Fehler beim Login.', error: error });
  }
});
// NEUE ROUTE: Eine Bestellung erstellen (geschützt)
app.post('/api/orders', async (req, res) => {
  try {
    // 1. Token aus dem Header extrahieren
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      // 401 = Unauthorized (nicht autorisiert)
      return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' });
    }

    // 2. Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // "decoded" enthält jetzt unseren Payload, den wir beim Login erstellt haben, z.B. { user: { id: '...' } }
    
    // 3. Bestelldaten aus dem Request-Body holen
    const { products, totalPrice } = req.body;

    // 4. Neue Bestellung erstellen
    const order = new Order({
      user: decoded.user.id, // Die ID des eingeloggten Benutzers aus dem Token
      products: products,
      totalPrice: totalPrice
    });

    // 5. Bestellung in der Datenbank speichern
    await order.save();

    res.status(201).json({ message: 'Bestellung erfolgreich aufgegeben!', order: order });

  } catch (error) {
    // Wenn der Token ungültig ist, wirft jwt.verify einen Fehler, den wir hier abfangen
    res.status(401).json({ message: 'Token ist nicht gültig.' });
  }
});

// NEUE ROUTE: Holt alle Bestellungen für den eingeloggten Benutzer (geschützt)
app.get('/api/orders/my-orders', async (req, res) => {
  try {
    // 1. Token aus dem Header extrahieren und verifizieren
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // 2. Alle Bestellungen für diese Benutzer-ID in der DB suchen.
    // Wir sortieren sie absteigend nach Datum, damit die neueste Bestellung oben steht.
    const orders = await Order.find({ user: userId }).sort({ orderDate: -1 });

    // 3. Die gefundenen Bestellungen zurücksenden
    res.json(orders);

  } catch (error) {
    res.status(401).json({ message: 'Token ist nicht gültig oder Server-Fehler.' });
  }
});

// Admin-Route
app.get('/api/admin/orders', async (req, res) => {
  // Ersetze den gesamten try-catch-Block der Admin-Route hiermit:
try {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user.id;
  const user = await User.findById(userId);

  // --- ULTIMATIVE DIAGNOSE ---
  if (!user) {
    console.log('DIAGNOSE: Benutzer nicht gefunden.');
    return res.status(404).json({ message: 'Benutzer für Token nicht gefunden.' });
  }
  
  const userRole = user.role;
  const isAdminString = 'admin';

  console.log(`DIAGNOSE: Rolle aus DB       -> '${userRole}'`);
  console.log(`DIAGNOSE: Typ der Rolle      -> ${typeof userRole}`);
  console.log(`DIAGNOSE: Länge der Rolle    -> ${userRole.length}`);
  console.log(`DIAGNOSE: Vergleichsstring   -> '${isAdminString}'`);
  console.log(`DIAGNOSE: Länge des Strings  -> ${isAdminString.length}`);
  console.log(`DIAGNOSE: Vergleich (userRole === 'admin') -> ${userRole === isAdminString}`);
  // --- ENDE DIAGNOSE ---

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Zugriff verweigert.' });
  }

  const allOrders = await Order.find({}).sort({ orderDate: -1 }).populate('user', 'email');
  res.json(allOrders);

} catch (error) {
  res.status(500).json({ message: 'Server-Fehler.', error });
}
});

// TEMPORÄRE ADMIN-PROMOTE-ROUTE (kann danach wieder gelöscht werden)
app.get('/api/make-admin/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true } // Gibt das aktualisierte Dokument zurück
    );

    if (!user) {
      return res.status(404).send('Benutzer nicht gefunden');
    }
    res.send(`Benutzer ${user.email} ist jetzt ein Admin!`);

  } catch (error) {
    res.status(500).send('Fehler: ' + error.message);
  }
});

// --- DATENBANK-VERBINDUNG & SERVER-START ---
// Dieser Block kommt GANZ ZUM SCHLUSS.
mongoose.connect(DB_CONNECTION_STRING)
  .then(async () => {
    console.log('✅ Erfolgreich mit der MongoDB-Datenbank verbunden!');
    // Wir rufen die Seeding-Funktion nach der Verbindung auf
    await seedDatabase(); 
    
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Fehler bei der Verbindung zur Datenbank:', err);
    process.exit(1);
  });


// Seeding-Funktion (kann hier unten bleiben)
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
    }
  } catch (error) {
    console.error('❌ Fehler beim Seeding der Datenbank:', error);
  }
}