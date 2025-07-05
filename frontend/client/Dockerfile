# Dockerfile für das Frontend --- KORRIGIERTE NODE-VERSION ---

# --- Stufe 1: Build-Umgebung ---
# KORREKTUR: Wir benutzen eine neuere Node.js Version, die von Angular CLI verlangt wird.
FROM node:22-alpine AS build

WORKDIR /app

# Kopiere die package.json Dateien und installiere die Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere den gesamten Frontend-Code
COPY . .

# Baue die Anwendung für die Produktion. Das Ergebnis landet im /app/dist/client/browser Ordner.
RUN npm run build


# --- Stufe 2: Produktions-Umgebung ---
# Wir benutzen einen sehr schlanken Nginx-Webserver, um die fertigen Dateien auszuliefern
FROM nginx:alpine

# Kopiere unsere eigene Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiere die gebaute Anwendung aus der ersten Stufe in den Webserver-Ordner
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Informiere Docker, dass der Webserver auf Port 80 lauscht
EXPOSE 80
