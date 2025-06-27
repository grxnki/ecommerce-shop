// 1. Notwendige Pakete importieren
const express = require('express');
const cors = require('cors');
// 2. Eine neue Express-Anwendung erstellen
const app = express();

app.use(cors());

// Füge diesen Block nach der Zeile "const app = express();" ein

// BEISPIEL-DATEN (später kommt das aus einer Datenbank)
const products = [
  {
    id: 1,
    name: 'Eco-Friendly Wasserflasche',
    description: 'Wiederverwendbare Wasserflasche aus nachhaltigen Materialien.',
    price: 15.99,
    imageUrl: 'https://example.com/images/waterbottle.jpg'
  },
  {
    id: 2,
    name: 'Solar-Powerbank',
    description: 'Lade deine Geräte unterwegs mit der Kraft der Sonne.',
    price: 39.99,
    imageUrl: 'https://example.com/images/powerbank.jpg'
  },
  {
    id: 3,
    name: 'Bambus-Zahnbürsten (4er-Pack)',
    description: 'Eine umweltfreundliche Alternative zu Plastikzahnbürsten.',
    price: 9.99,
    imageUrl: 'https://example.com/images/toothbrush.jpg'
  }
];

// 3. Den Port definieren, auf dem der Server laufen soll
// Wir wählen 3000 für das Backend. Das Frontend (Angular) läuft später standardmäßig auf 4200.
const PORT = 3000;

// 4. Eine erste "Route" definieren
// Eine Route ist wie eine URL-Adresse. Wenn jemand http://localhost:3000/ aufruft,
// wird die Funktion hier ausgeführt.
app.get('/', (req, res) => {
  // Wir senden eine einfache JSON-Antwort zurück
  res.json({ message: "Willkommen bei der E-Commerce API!" });
});

// Füge diesen Block vor "app.listen(...)" ein

// NEUE ROUTE: Gibt alle Produkte zurück
// Es ist eine gute Konvention, API-Routen mit "/api" zu beginnen.
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
});
// 5. Den Server starten und ihn auf dem definierten Port "lauschen" lassen
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

app.get('/api/products/:id', (req, res) => {
  // Die ID aus der URL auslesen (z.B. "1")
  // req.params.id ist immer ein String, daher wandeln wir ihn in eine Zahl um
  const id = parseInt(req.params.id, 10);

  // Finde das Produkt im Array, dessen ID übereinstimmt
  const product = products.find(p => p.id === id);

  // Wenn ein Produkt gefunden wurde, sende es zurück
  if (product) {
    res.json(product);
  } else {
    // Wenn kein Produkt mit dieser ID existiert, sende einen 404-Fehler
    res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
});