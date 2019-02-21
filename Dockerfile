FROM node:10

#Create dedicated user to avoid running the app as root
RUN useradd --user-group --create-home --shell /bin/false app

#Create directory structure
ENV HOME=/home/app
COPY package.json /tmp/package.json
RUN cd /tmp && npm install

#Change to the new user
COPY . /home/app
RUN rm -rf node_modules && chown -R app:app $HOME/*

USER app
WORKDIR $HOME
RUN cp -a /tmp/node_modules $HOME/

# CMD ["/home/app/node_modules/.bin/nodemon"]
CMD ["node", "./bin/www"]
