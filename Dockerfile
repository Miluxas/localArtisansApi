FROM node:16.13.1-alpine As builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn config set disable-self-update-check true
RUN yarn install
COPY . .
RUN yarn build
RUN npm prune --production

FROM node:16.13.1-alpine as runner
ARG NODE_ENV=local
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/config ./config
# COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env.example ./.env
COPY --from=builder /usr/src/app/dist/ormconfig.js ./ormconfig.js

EXPOSE 3001
CMD yarn start:prod

