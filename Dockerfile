# Container image that runs your code
FROM node:18-alpine
RUN apk add --no-cache libc6-compat
COPY . .
RUN npm install
RUN npm run build -- --filter=action
ENTRYPOINT ["node", "/packages/action"]
