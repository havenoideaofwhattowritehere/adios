FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && \
    npm cache clean --force
   

COPY . .

RUN npm run build

ARG VERSION=dev
RUN echo $VERSION > /usr/src/app/version.txt

EXPOSE 3000

CMD sh -c "npx sequelize-cli db:migrate && npm start"

