const express = require('express');
const app = express();
const port = 8080
const url = require('url');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var helmet = require('helmet');
var requestAPI = require('request');
var cheerio = require("cheerio");
var sql = require("./lib/sql.js");

app.use(helmet());
app.use('/public', express.static('public'));

var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var db = mysql.createConnection(dbconfig);
db.connect();

app.get('/', function (request, response) {
  sql.index(request, response);});

app.get('/user', function (request, response) {
  sql.user(request, response);});

app.get('/statistic', function (request, response) {
  sql.statistic(request, response);});

app.get('/character/:characterId', function (request, response) {
  sql.character(request, response);});
  
app.get('/character/:characterId/:position', function (request, response) {
  sql.position(request, response);});

app.get('/contact', function (request, response) {
  fs.readFile(`contact.html`, 'utf8', function (err, description) {
      response.send(description);
  });
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
 
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});
