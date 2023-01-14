const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const ENV = process.env.ENV;

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

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname + '/pages/home.html'));
});

app.get('/login', function(req,res){
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
    res.cookie('_db_sess', 1, { maxAge: response.data.data.lifetime });
    res.status(200).json({ message: 'successfully logged in!' });
  })
  .catch(function (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  });
});

app.listen(80);