FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./

ENV SMTP_PORT=9425
ENV SMTP_USER=dev
ENV SMTP_PASSWORD=test123
ENV WEBHOOK_URL=http://localhost:3000

EXPOSE 9425

CMD ["node", "index.js"]
