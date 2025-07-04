# Etapa 1: construir la app
FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Etapa 2: usar un servidor estático (http-server)
FROM node:20-slim

WORKDIR /app

RUN npm install -g http-server

COPY --from=builder /app/dist .

EXPOSE 4173

CMD ["http-server", "-p", "4173"]
