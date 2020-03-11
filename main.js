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


app.get('/statistic', function (request, response) {
  fs.readFile(`statistic.html`, 'utf8', function (err, description) {
    if (err) throw err;
    var buildSql = 'SELECT * FROM positionInfo';
    db.query(buildSql, function (err, rows) {
      response.send(ejs.render(description,
        { Info: rows }));
    });
  });
});

app.get('/character/:characterId', function (request, response) {
  fs.readFile(`list.html`, 'utf8', function (err, description) {
    if (err) throw err;
    var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
    var cleanTitle = sanitizeHtml(title);
    var buildSql = 'SELECT * FROM build WHERE `character` = ' + mysql.escape(cleanTitle) + ' ';
    db.query(buildSql, function (err, rows) {
        response.send(ejs.render(description,
          { pageName: cleanTitle, build: rows}));
      });
    });
  });


app.get('/character/:characterId/:position', function (request, response) {
  fs.readFile(`list.html`, 'utf8', function (err, description) {
    if (err) throw err;
    var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
    var cleanTitle = sanitizeHtml(title);
    var cleanPosition = sanitizeHtml(request.params.position);
    var buildSql = 'SELECT * FROM build WHERE `character` = '+mysql.escape(cleanTitle)+' AND position = '+mysql.escape(cleanPosition)+' ';
      db.query(buildSql, function (err, bulidList) {
          response.send(ejs.render(description,
            { pageName: cleanTitle, build: bulidList}));
        });   
    });
  });


app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});
