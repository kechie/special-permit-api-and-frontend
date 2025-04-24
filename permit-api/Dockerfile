# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

#WORKDIR /usr/src/app
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Enable Corepack and install correct Yarn version
RUN corepack enable && \
    corepack prepare yarn@4.9.1 --activate && \
    yarn config set nodeLinker node-modules && \
    yarn install --frozen-lockfile

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.

# RUN yarn install --immutable --immutable-cache --network-timeout 1000000

# Run the application as a non-root user.
# Commented out to use node-tls volume for the TLS certificate.
# RUN addgroup -S app && adduser -S app -G app
# TODO: fix permissions perhaps by copying the certificates to another volume and 
# changing ownership there
# USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3021

# Run the application.
#CMD yarn start

# Run the application with JSON syntax
CMD ["yarn", "start"]