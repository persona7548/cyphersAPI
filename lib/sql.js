var dbconfig = require('../config/database.js');
const express = require('express');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var mysql = require('mysql');
var sanitizeHtml = require('sanitize-html');
var db = mysql.createConnection(dbconfig);
db.connect();

exports.user = function (request, response) {  fs.readFile(`user.html`, 'utf8', function (err, description) {
    var userSqlTemp = 'SELECT * FROM user WHERE userID = ?';
    requestAPI({
        url: 'https://api.neople.co.kr/cy/players?nickname=' + encodeURI(
            request.query.userName
        ) + '&apikey='
    }, function (err, res, body) {
        if (err) {
            console.log(err);
            return;
        }
        var arr = JSON.parse(body)
        if ((arr.rows[0] === undefined)) {
            response.send(ejs.render(description, {userID: "없는 ID"}));
        } else {
            var userSql = mysql.format(userSqlTemp, arr.rows[0].playerId);
            db.query(userSql, function (error, rows) {
                if(error){
                    
                }
                response.send(ejs.render(description, {userDB: rows}));
            });
        }
    });
});}

exports.index = function (request, response) {
        var charInfo = 'SELECT * FROM `characters`';
        db.query(charInfo, function (err, results) {
        fs.readFile(`index.html`, 'utf8', function (err, description) {
            response.send(ejs.render(description, {
               prodList: results
            }));
        });
    });
}

exports.statistic =  function(request, response){
    fs.readFile(`statistic.html`, 'utf8', function (err, description) {
        if (err)  next(err);
        var buildSql = 'SELECT * FROM positionInfo';
        db.query(buildSql, function (err, rows) {
          response.send(ejs.render(description,
            { Info: rows }));
        });
      });
    }

exports.character = function(request, response){
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
    }

exports.position = function(request, response){
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
    }
