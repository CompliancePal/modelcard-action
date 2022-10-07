FROM node:18-alpine3.14 as builder

WORKDIR /action
COPY . .
RUN corepack enable
RUN yarn workspace @compliancepal/modelcard-action install --immutable
RUN yarn workspace @compliancepal/modelcard-action build

FROM node:18-alpine3.14

COPY --from=builder /action/packages/action/dist /action/packages/action/dist
COPY --from=builder /action/packages/action/resources /action/packages/action/resources
COPY --from=builder /action/node_modules /action/node_modules
COPY package.json /action

ENTRYPOINT ["node", "/action"]
