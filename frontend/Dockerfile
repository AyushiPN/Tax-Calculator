FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./


RUN npm install


COPY . .


EXPOSE 5173


CMD ["npm", "start"]
