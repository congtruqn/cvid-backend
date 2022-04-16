FROM node:16

WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0
ENV MONGO_DSN $_MONGO_DSN

COPY package*.json ./

RUN npm install

# Copy the local code to the container
COPY . .


# Start the service
CMD npm start
