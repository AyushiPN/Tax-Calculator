FROM node:18-alpine

# Specify the build argument for VP_ARTIFACTORY_TOKEN
ARG VP_ARTIFACTORY_TOKEN

WORKDIR /usr/src

# Set up npm authentication using the build argument
RUN echo "//registry.npmjs.org/:_authToken=${VP_ARTIFACTORY_TOKEN}" > .npmrc

# Copy package.json
COPY package*.json ./

# Install npm packages
RUN npm install

# Set the environment variable
ENV VP_ARTIFACTORY_TOKEN=$VP_ARTIFACTORY_TOKEN

EXPOSE 5173

CMD ["npm", "start"]
