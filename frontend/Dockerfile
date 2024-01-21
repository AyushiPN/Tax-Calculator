FROM node:18-alpine

ARG VP_ARTIFACTORY_TOKEN

WORKDIR /usr/src

COPY package*.json ./
COPY .npmrc ./

RUN echo "//registry.npmjs.org/:_authToken=${VP_ARTIFACTORY_TOKEN}" > .npmrc && \
    npm install

ENV VP_ARTIFACTORY_TOKEN=$VP_ARTIFACTORY_TOKEN

EXPOSE 5173

CMD ["npm", "start"]
