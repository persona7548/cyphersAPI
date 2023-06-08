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
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

app.use(expressCspHeader({
    directives: {
        'script-src': [SELF, INLINE,,"cdn.jsdelivr.net/npm/apexcharts","https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.20/sp-1.0.1/sl-1.3.1/datatables.min.js"
        ,"https://cdn.jsdelivr.net/npm/chart.js", "https://www.google-analytics.com/analytics.js","https://cdnjs.cloudflare.com", "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js", "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js","https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        "https://unpkg.com","*.googletagmanager.com"],
    }
}));
app.use(helmet());

app.use('/public', express.static('public'));

var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var db = mysql.createConnection(dbconfig);
db.connect();

app.get('/', function (request, response) {
  sql.index(request, response);});

  app.get('/robots.txt', function (request, response) {
    fs.readFile(`robots.txt`, 'utf8', function (err, description) {
      response.send(description);
  });});

app.get('/match', function (request, response) {
    sql.match(request, response);});

app.get('/ranking', function (request, response) {
  sql.ranking(request, response);});

app.get('/user', function (request, response) {
  sql.user(request, response);});
app.get('/vs', function (request, response) {
  sql.vs(request, response);});

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
  fs.readFile(`contact.html`, 'utf8', function (err, description) {
    res.status(404).send(description);
});
});
 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  fs.readFile(`contact.html`, 'utf8', function (err, description) {
    res.status(500).send(description);
});
});
 
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});


