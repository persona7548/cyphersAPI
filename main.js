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

app.use('/public',express.static('public'));

var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var db = mysql.createConnection(dbconfig);
db.connect();

app.get('/', function (request, response) {
  db.query("SELECT * FROM `characters`", function (err, charlist) {
    fs.readFile(`index.html`, 'utf8', function (err, description) {
      response.send(ejs.render(description, { prodList: charlist }));
    });
  });
});

app.get('/character/:characterId', function (request, response) {
  fs.readFile(`list.html`, 'utf8', function (err, description) {
    if (err) throw err;
    var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
    var cleanTitle = sanitizeHtml(title);
    db.query("SELECT * FROM `build` WHERE `character` LIKE \'" + cleanTitle + "\' LIMIT 0, 30 ", function (err, rows) {
      db.query("SELECT * FROM `characters` WHERE `character` LIKE \'" + cleanTitle + "\' LIMIT 0, 30 ", function (err, char) {
        response.send(ejs.render(description,
          { pageName: cleanTitle, build: rows, img: char[0].characterID }));
      });
    });
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});
