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
    var tank = 'SELECT * FROM positioninfo WHERE position = "탱커"; ';
    var melee = 'SELECT * FROM positioninfo WHERE position = "근거리딜러"; ';
    var ad = 'SELECT * FROM positioninfo WHERE position = "원거리딜러"; ';
    var sup = 'SELECT * FROM positioninfo WHERE position = "서포터"; ';
    var charInfo = 'SELECT * FROM `characters`';
    db.query(tank + melee + ad + sup + charInfo, function (err, results) {
        fs.readFile(`index.html`, 'utf8', function (err, description) {
            response.send(ejs.render(description, {
                tank: results[0],
                melee: results[1],
                ad: results[2],
                sup: results[3],
                prodList: results[4]
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
