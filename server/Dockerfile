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

# Create sessions directory with proper permissions
RUN mkdir -p /home/node/app/sessions && chown -R node:node /home/node/app/sessions

# Set environment variables for Docker deployment
ENV NODE_ENV=production
ENV DOCKER=true

EXPOSE 4008

USER node

CMD ["npm", "start"]