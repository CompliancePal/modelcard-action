FROM node:18-alpine3.14 as builder

WORKDIR /action
COPY . .
# RUN echo "nodeLinker: node-modules" > .yarnrc.yml
RUN corepack enable
RUN yarn install --immutable
RUN yarn build

FROM node:18-alpine3.14

COPY --from=builder /action/dist /action/dist
COPY --from=builder /action/resources /action/resources
COPY --from=builder /action/node_modules /action/node_modules

ENTRYPOINT ["node", "/action/dist"]
