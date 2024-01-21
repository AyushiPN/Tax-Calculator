FROM node:18-alpine

ARG VP_ARTIFACTORY_TOKEN

WORKDIR /usr/src

RUN echo "//registry.npmjs.org/:_authToken=${VP_ARTIFACTORY_TOKEN}" > .npmrc && \
    npm config set registry https://registry.npmjs.org/

COPY package*.json ./

RUN npm install

ENV VP_ARTIFACTORY_TOKEN=$VP_ARTIFACTORY_TOKEN

EXPOSE 5173

CMD ["npm", "start"]
