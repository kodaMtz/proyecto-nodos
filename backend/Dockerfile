FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p nodos
CMD ["sh", "-c", "npm run start:nodo${NODO_ID}"]