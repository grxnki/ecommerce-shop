# Praxisprojekt: E-Commerce Shop

Dies ist eine vollständige Full-Stack E-Commerce-Anwendung, die im Rahmen eines geführten Entwicklungsprozesses erstellt wurde. Die Anwendung umfasst ein Frontend mit Angular, ein Backend mit Node.js/Express und eine Anbindung an eine MongoDB-Datenbank. Zu den wichtigsten Funktionen gehören Produktanzeige, Benutzerauthentifizierung, ein Warenkorb, ein Bestellprozess sowie ein geschützter Admin-Bereich.

## Technologie-Stack

* **Frontend**: Angular, TypeScript, Angular Material
* **Backend**: Node.js, Express.js
* **Datenbank**: MongoDB mit Mongoose
* **Authentifizierung**: JSON Web Tokens (JWT), bcrypt
* **API-Testing**: REST Client (VSCode Extension)
* **Deployment (Lokal)**: Docker, Docker Compose, Kubernetes (via Docker Desktop), NGINX

## Features

* Anzeige von Produkten (Übersicht und Detailansicht)
* Benutzer-Registrierung und -Login mit sicherer Passwortverschlüsselung
* Zustandsbasiertes UI (z.B. Anzeige von "Login" vs. "Logout")
* Client-seitiger Warenkorb
* Bestellprozess für eingeloggte Benutzer mit Speicherung in der Datenbank
* Bestellhistorie für eingeloggte Benutzer
* Geschützter Admin-Bereich zur Ansicht aller Bestellungen
* Monitoring-Endpunkt für Prometheus-Metriken

## Voraussetzungen

* [Node.js](https://nodejs.org/) (empfohlen über `nvm`)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) mit aktiviertem Kubernetes
* Ein kostenloser [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)-Account
* `git` für die Versionskontrolle

## Lokale Installation und Ausführung

**1. Repository klonen:**
```bash
git clone <deine-github-repository-url>
cd ecommerce-shop
```

**2. Backend einrichten:**
```bash
cd backend
npm install
```
Erstelle eine `.env`-Datei im `backend`-Ordner mit folgendem Inhalt:
```
MONGO_URI="Dein_MongoDB_Atlas_Connection_String"
JWT_SECRET="Dein_persönlicher_geheimer_Schlüssel"
```

**3. Frontend einrichten:**
```bash
cd frontend/client
npm install
```

**4. Anwendung im Entwicklungsmodus starten:**
* **Backend-Terminal:**
    ```bash
    cd backend
    node index.js 
    # Der Server läuft auf http://localhost:3000
    ```
* **Frontend-Terminal:**
    ```bash
    cd frontend/client
    startdev # (Unser benutzerdefinierter Befehl zum Laden der richtigen Node-Version)
    ng serve
    # Die Anwendung ist unter http://localhost:4200 erreichbar
    ```

##