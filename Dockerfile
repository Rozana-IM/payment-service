FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci   # faster than npm install

COPY . .

EXPOSE 4002

CMD ["node", "src/app.js"]
