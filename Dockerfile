# Container image that runs your code
FROM node:18-alpine3.14
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT ["node", "/dist/index.js"]