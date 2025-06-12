FROM node:23-alpine AS builder

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

RUN npm prune --production

FROM node:23-alpine

WORKDIR /home/node/app

RUN npm i pm2 -g

COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/ecosystem.config.js ./
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/dist ./dist

# Set environment variables for Docker deployment
ENV NODE_ENV=production
ENV DOCKER=true
ENV DB_PATH=/home/node/app/db/snapmda.db

# Create db directory for volume mounting with proper ownership
RUN mkdir -p /home/node/app/db && chown -R node:node /home/node/app/db && chmod -R 755 /home/node/app/db

EXPOSE 4001

USER node

CMD ["npm", "start"]