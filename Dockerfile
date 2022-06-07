# Container image that runs your code
FROM node:18-alpine3.14
COPY . .
RUN npm install
RUN npx ncc build src/index.ts --license licenses.txt
CMD ["node", "/dist/index.js"]