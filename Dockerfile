# Stage 1
# FROM node:10-alpine as build-step

# RUN mkdir -p /app

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# RUN npm run build --prod

# # Stage 2

# FROM nginx:1.17.1-alpine

# COPY --from=build-step /app/dist/game /usr/share/nginx/html

# EXPOSE 80


#############
### build ###
#############

# base image
FROM node:12.2.0 as build

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >>     /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@11.0.7

# add app
COPY . /app

# run tests
RUN ng test --browsers=Headless --no-watch
#RUN ng e2e --port 4202

# generate build
RUN ng build --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
