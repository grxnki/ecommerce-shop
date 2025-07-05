# Dockerfile für das Backend

# --- Stufe 1: Build-Umgebung ---
# Wir starten mit einem schlanken Node.js-Image
FROM node:18-alpine AS builder

# Wir setzen das Arbeitsverzeichnis im Container
WORKDIR /app

# Wir kopieren zuerst nur die package.json-Dateien, um den Docker-Cache optimal zu nutzen
COPY package*.json ./

# Wir installieren die Abhängigkeiten
RUN npm install

# Wir kopieren den restlichen Quellcode
COPY . .


# --- Stufe 2: Produktions-Umgebung ---
# Wir starten wieder mit einem sauberen, schlanken Image
FROM node:18-alpine

WORKDIR /app

# Wir kopieren nur die notwendigen Dateien aus der Build-Umgebung
COPY --from=builder /app .

# Wir informieren Docker, dass unser Server auf Port 3000 lauscht
EXPOSE 3000

# Der Befehl, der beim Starten des Containers ausgeführt wird
CMD ["node", "index.js"]