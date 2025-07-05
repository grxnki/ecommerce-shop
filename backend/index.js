// =================================================================
// E-COMMERCE SHOP BACKEND - FINALE VERSION
// =================================================================

// 1. IMPORTE
// -----------------------------------------------------------------
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path'); // NEU: Importieren für die Pfad-Verwaltung
require('dotenv').config();

// Monitoring-Pakete
const client = require('prom-client');
const pino = require('pino-http')();

// Datenbank-Modelle
const Product = require('./models/product.model.js');
const User = require('./models/user.model.js');
const Order = require('./models/order.model.js');


// 2. INITIALISIERUNG
// -----------------------------------------------------------------
const app = express();
const PORT = 3000;


// 3. MONITORING SETUP
// -----------------------------------------------------------------
// Pino als Logger-Middleware benutzen
app.use(pino);

// Prometheus-Metriken initialisieren
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware für den Request-Zähler
app.use((req, res, next) => {
  res.on('finish', () => {
    // Wir zählen nur erfolgreiche Anfragen zu gültigen Routen
    if (req.route) {
        httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: res.statusCode });
    }
  });
  next();
});


// 4. STANDARD-MIDDLEWARES
// -----------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// 5. API-ROUTEN
// -----------------------------------------------------------------
// Willkommens-Route
app.get('/', (req, res) => {
  req.log.info('GET / aufgerufen');
  res.json({ message: "Willkommen bei der E-Commerce API! Der Server läuft." });
});

// Prometheus-Metriken-Route
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Alle Produkte abrufen
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.json(allProducts);
  } catch (error) { res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' }); }
});

// Ein Produkt abrufen
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } 
    else { res.status(404).json({ message: 'Produkt nicht gefunden' }); }
  } catch (error) { res.status(500).json({ message: 'Fehler beim Abrufen des Produkts' }); }
});

// Benutzer registrieren
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) { return res.status(400).json({ message: 'Ein Benutzer mit dieser E-Mail existiert bereits.' }); }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
  } catch (error) { res.status(500).json({ message: 'Server-Fehler bei der Registrierung.', error: error }); }
});

// Benutzer einloggen
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) { return res.status(400).json({ message: 'E-Mail oder Passwort ist falsch.' }); }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(400).json({ message: 'E-Mail oder Passwort ist falsch.' }); }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) { res.status(500).json({ message: 'Server-Fehler beim Login.', error: error }); }
});

// Bestellung aufgeben (geschützt)
app.post('/api/orders', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' }); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { products, totalPrice } = req.body;
    const order = new Order({ user: decoded.user.id, products: products, totalPrice: totalPrice });
    await order.save();
    res.status(201).json({ message: 'Bestellung erfolgreich aufgegeben!', order: order });
  } catch (error) { res.status(401).json({ message: 'Token ist nicht gültig.' }); }
});

// Eigene Bestellungen abrufen (geschützt)
app.get('/api/orders/my-orders', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' }); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ user: decoded.user.id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) { res.status(401).json({ message: 'Token ist nicht gültig oder Server-Fehler.' }); }
});

// Admin: Alle Bestellungen abrufen (geschützt)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { return res.status(401).json({ message: 'Kein Token, Autorisierung verweigert.' }); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user || user.role !== 'admin') { return res.status(403).json({ message: 'Zugriff verweigert.' }); }
    const allOrders = await Order.find({}).sort({ orderDate: -1 }).populate('user', 'email');
    res.json(allOrders);
  } catch (error) { res.status(500).json({ message: 'Server-Fehler.', error }); }
});


// 6. HELFERFUNKTIONEN
// -----------------------------------------------------------------
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


// 7. SERVER START
// -----------------------------------------------------------------
const startServer = async () => {
  try {
    console.log('Versuche, eine Verbindung zur Datenbank herzustellen...');
    const connectionString = process.env.MONGO_URI;
    
    if (!connectionString) {
      console.error('❌ FEHLER: MONGO_URI nicht in der .env-Datei gefunden oder geladen!');
      process.exit(1);
    }
    
    await mongoose.connect(connectionString);
    console.log('✅ Erfolgreich mit der MongoDB-Datenbank verbunden!');
    
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Ein kritischer Fehler ist beim Serverstart aufgetreten:', error);
    process.exit(1);
  }
};

startServer();