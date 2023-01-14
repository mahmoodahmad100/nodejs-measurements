const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(cookieParser(), function(req, res, next) {
  let _db_sess = req.cookies._db_sess;
  if (_db_sess && verify(_db_sess) || req.path == '/login') {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/pages/home.html'));
});

app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname + '/pages/login.html'));
});

app.listen(80);