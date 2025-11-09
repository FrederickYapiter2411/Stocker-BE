FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/src

# Jalankan server
EXPOSE 5000

CMD ["npm", "start"]