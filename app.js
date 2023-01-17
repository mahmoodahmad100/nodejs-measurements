const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const querystring = require('querystring');
const mongoose = require('mongoose');
const app = express();
const ENV = process.env.ENV;
const Measurement = require('./models/measurement');

// DB credentials
let username    = process.env.MONGO_INITDB_ROOT_USERNAME;
let password    = process.env.MONGO_INITDB_ROOT_PASSWORD;
let service     = process.env.MONGO_SERVICE;
let port        = process.env.MONGO_PORT;
let mongoString = `mongodb://${username}:${password}@${service}:${port}/measurements?authSource=admin`;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(), function(req, res, next) {
  let _db_sess = req.cookies._db_sess;
  if (_db_sess || req.path == '/login' || req.path == '/auth/login') {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/', async function(req, res){
  res.sendFile(path.join(__dirname + '/pages/home.html'));
});

app.get('/setup', function(req, res){
  res.sendFile(path.join(__dirname + '/pages/setup.html'));
});

app.get('/login', function(req, res){
  if (ENV == 'dev' && (!req.query.email || !req.query.password)) {
    let email = encodeURIComponent(process.env.EMAIL);
    let password = encodeURIComponent(process.env.PASSWORD);
    res.redirect(`/login?email=${email}&password=${password}`);
  }

  res.sendFile(path.join(__dirname + '/pages/login.html'));
});

app.post('/auth/login', async (req, res) => {
  await axios.post(`${process.env.API_BASE_URL}/auth/auth`, req.body)
  .then(function (response) {
    for (let i = 0; i < response.headers['set-cookie'].length; i++) {
      let _db_sess_cookie = response.headers['set-cookie'][i].match(/_db_sess=\s*([^;]*)/gi);
      if (_db_sess_cookie) {
        res.cookie(
          '_db_sess',
          _db_sess_cookie[0].substring(_db_sess_cookie[0].indexOf('=') + 1),
          { maxAge: response.data.data.lifetime }
        );

        res.status(200).json({
          message: 'successfully logged in!',
          data: {
            muid: process.env.MUID,
            start: process.env.START,
            stop: process.env.STOP,
            measurement: process.env.MEASUREMENT,
            limit: process.env.LIMIT
          }
        });
      }
    }
  })
  .catch(function (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  });
});

app.post('/measurements', async (req, res) => {
  let current_querystring = querystring.unescape(querystring.stringify(req.body));

  await axios.get(`${process.env.API_BASE_URL}/meterdata/measurement?${current_querystring}`, {
    headers: {
      Cookie: `_db_sess=${req.cookies._db_sess};`
    }
  })
  .then(function (response) {
    Measurement.create(response.data.data);
    console.log(response);
    res.status(200).json({message: 'Success.', data: response.data.data});
  })
  .catch(function (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  });
});

app.get('/measurements', async (req, res) => {
  let data = await Measurement.find({});
  res.status(200).json(data);
});

app.listen(80);