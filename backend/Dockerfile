FROM node:14-alpine3.12

LABEL Maintainer="ramazanakkulak"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci --only=development

# Bundle app source
COPY . .

ENV TENANTID={your_tenantid}
ENV CLINENTID={your_clientid}
ENV APPSECRETKEY={your_secretkey}
ENV AZUREVAULTURL={your_vaulturl}

EXPOSE 80

CMD [ "npm", "run", "start:dev"]