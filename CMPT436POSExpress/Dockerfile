FROM ubuntu:latest
MAINTAINER Nikolaos Konstantinidis <nick.kon@usask.ca>

RUN apt-get update
RUN apt-get -y install sudo

#RUN DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server

RUN sudo apt-get update
RUN sudo apt-get -y install gnupg2
RUN sudo apt-get -y install curl

#Latest LTS of Nodejs
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
RUN apt-get -y install nodejs

RUN sudo apt-get -y install systemd

#RUN sudo service mysql start

#TODO setup sql server for POS system


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install mysql
RUN npm install

#bundle app source
COPY . .

#not actually exposing. needs port in docker run command
EXPOSE 8080

#CMD [ "npm", "start" ]
