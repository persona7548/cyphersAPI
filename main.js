const express = require('express')
const app = express()
const port = 3000
const url = require('url');
var ejs  = require('ejs');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var template = require('./lib/template.js');

var dbconfig = require('./config/database.js');
var db = mysql.createConnection(dbconfig);
db.connect();
app.use(express.static('character'));


app.get('/', function (request, response) {
  fs.readdir('./character/thumb', function (error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list, 
      `<h2>${title}</h2>${description}`,
      `<img src="https://img-api.neople.co.kr/cy/characters/d69971a6762d94340bb2332e8735238a" alt="${list}"/>
      `);
    response.send(html);
  });
});

app.get('/character/:characterId', function (request, response) {
    fs.readFile(`list.html`, 'utf8', function (err, description) {
      var title = path.basename(request.params.characterId,path.extname(request.params.characterId));
      var cleanTitle = sanitizeHtml(title);
      var html = (`<img src="/thumb/${title}.jpg" alt="${title}"/>`);
      db.query("SELECT * FROM `build` WHERE `character` LIKE \'" + cleanTitle + "\' LIMIT 0, 30 ", function (err, rows) {
        if (err) throw err;
        response.send(ejs.render(description,
          {pageName:cleanTitle,prodList:rows,img:html}));
      });
    });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});
