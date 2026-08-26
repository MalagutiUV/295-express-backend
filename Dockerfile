FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm ci --omit=dev

COPY src ./src
COPY uploads ./uploads

EXPOSE 3000

CMD ["node", "src/app.ts"]