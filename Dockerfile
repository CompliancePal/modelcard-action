# Container image that runs your code
FROM node:18-alpine3.14
COPY . .
RUN corepack enable
RUN yarn install
RUN yarn build
ENTRYPOINT ["yarn", "node", "/dist/index.js"]
