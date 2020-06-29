FROM node:lts-alpine

WORKDIR /app
COPY package.json .
# only install prod dependencies
RUN npm install --only=prod 
COPY . .

CMD ["npm", "start"]