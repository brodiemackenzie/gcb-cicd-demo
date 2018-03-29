FROM gcr.io/google-appengine/nodejs

WORKDIR /hello

COPY package.json /hello/
RUN npm install
COPY . /hello/

EXPOSE 8080

CMD ["npm", "start"]
