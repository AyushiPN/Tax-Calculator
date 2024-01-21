FROM node:18-alpine
ARG VP_ARTIFACTORY_TOKEN

WORKDIR /usr/src

COPY package*.json ./

# Set npm registry and authentication token
RUN echo "//registry.npmjs.org/:_authToken=${VP_ARTIFACTORY_TOKEN}" > .npmrc

RUN npm install

EXPOSE 5173

CMD ["npm", "start"]
