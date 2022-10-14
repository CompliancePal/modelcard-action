# Container image that runs your code
FROM node:18-alpine3.14
COPY . .
RUN npm install --workspace action
RUN npm run build --workspace action
ENTRYPOINT ["node", "/packages/action"]
