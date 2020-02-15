FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
RUN yarn global add ganache-cli @adonisjs/cli
RUN yarn && mv node_modules ../
COPY . .
EXPOSE 3333
CMD yarn start
