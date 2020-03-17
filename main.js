const express = require('express');
const app = express();
const port = 8080
const url = require('url');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var template = require('./lib/template.js');
var helmet = require('helmet');
app.use(helmet());
app.use('/public', express.static('public'));
var mysql = require('mysql');
var dbconfig = require('./config/database.js');

var db = mysql.createConnection(dbconfig);
db.connect();

app.get('/', function (request, response) {
    var charInfo = 'SELECT * FROM `characters`';
    db.query(charInfo, function (err, results) {
        fs.readFile(`index.html`, 'utf8', function (err, description) {
            response.send(ejs.render(description, {
               prodList: results
            }));
        });
    });
});
app.get('/contact', function (request, response) {
      fs.readFile(`contact.html`, 'utf8', function (err, description) {
          response.send(description);
      });
  });


app.get('/statistic', function (request, response) {
  fs.readFile(`statistic.html`, 'utf8', function (err, description) {
    if (err)  next(err);
    var buildSql = 'SELECT * FROM positionInfo';
    db.query(buildSql, function (err, rows) {
      response.send(ejs.render(description,
        { Info: rows }));
    });
  });
});

app.get('/character/:characterId', function (request, response) {
  fs.readFile(`list.html`, 'utf8', function (err, description) {
    if (err) next(err);
    var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
    var cleanTitle = sanitizeHtml(title);
    var charSqlTemp = 'SELECT * FROM positionInfo WHERE `character` = ? ;';
    var charSql = mysql.format(charSqlTemp,cleanTitle);
    var buildSqlTemp = 'SELECT * FROM builddetail WHERE `character` = ?';
    var buildSql = mysql.format(buildSqlTemp,cleanTitle);
    db.query(charSql+buildSql, function (err, rows) {
        response.send(ejs.render(description,
          { pageName: cleanTitle,charInfo : rows[0], build: rows[1]}));
      });
    });
  });

app.get('/character/:characterId/:position', function (request, response) {
  fs.readFile(`list.html`, 'utf8', function (err, description) {
    if (err) next(err);
    var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
    var cleanTitle = sanitizeHtml(title);
    var cleanPosition = sanitizeHtml(request.params.position);
    var charSql = 'SELECT * FROM positionInfo WHERE `character` = ' + mysql.escape(cleanTitle) + ';';
    var buildSql = 'SELECT * FROM builddetail WHERE `character` = '+mysql.escape(cleanTitle)+' AND position = '+mysql.escape(cleanPosition)+' ';
      db.query(charSql+buildSql, function (err, rows) {
      response.send(ejs.render(description,
        { pageName: cleanTitle,charInfo : rows[0], build: rows[1]}));
    });
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
