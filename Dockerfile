FROM node:23-alpine

RUN apk update && apk add util-linux

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Build the project inside the container
RUN npm run build

ENV NODE_ENV=production

EXPOSE 5555

CMD ["npx", "pm2-runtime", "start", "ecosystem.config.cjs"]