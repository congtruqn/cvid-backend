FROM node:16

WORKDIR /usr/src/app

ENV MONGO_DSN $_MONGO_DSN

COPY package*.json ./

RUN npm install

# Copy the local code to the container
COPY . .


# Start the service
CMD npm start