'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const allRouters = require('./routes/index.route'); 

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  cors({
  origin: CLIENT_ORIGIN
  })
);

app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api', allRouters); 

let server;

function runServer() {
  const port = PORT;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
        resolve(server);
      })
      .on('error', err => {
        console.error('Express failed to start');
        console.error(err);
        reject(err);
      });
  });  
}

function closeServer(){
  return new Promise((resolve,reject) => {
    console.log('closing server'); 
    server.close(err => {
      if (err) {
        reject(err);
      }
      resolve(); 
    });
  });
}

if (require.main === module) {
  dbConnect();
  runServer();
}



module.exports = { app, runServer, closeServer };
