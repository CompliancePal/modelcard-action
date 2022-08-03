# Container image that runs your code
FROM node:18-alpine3.14 as builder
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine3.14
COPY ./package* .
COPY ./resources ./resources
COPY --from=builder /dist /dist
RUN npm install --production
ENTRYPOINT ["node", "/dist/index.js"]
