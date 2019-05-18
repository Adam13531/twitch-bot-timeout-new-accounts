###########################
FROM node:10-alpine AS base
###########################
RUN apk update

####################
FROM base AS builder
####################
WORKDIR /tmp/builder

COPY package.json .
RUN yarn --production

##################
FROM base AS final
##################
WORKDIR /var/app

COPY main.js .
COPY tmiclient.js .
COPY botstate.js .

COPY --from=builder /tmp/builder/node_modules node_modules
COPY --from=builder /tmp/builder/package.json .

ENTRYPOINT ["yarn", "start"]
