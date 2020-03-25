var dbconfig = require('../config/database.js');
var apiconfig = require('../config/api_key.js');
const express = require('express');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var moment = require('moment');
var mysql = require('mysql');
var sanitizeHtml = require('sanitize-html');
var db = mysql.createConnection(dbconfig);
var requestAPI = require('request');
db.connect();

exports.user = function (request, response) {  
    requestAPI({url: 'https://api.neople.co.kr/cy/players?nickname=' + encodeURI(request.query.userName),headers:apiconfig}, function (err, res, body) {
        if (err) throw error;
        var arr = JSON.parse(body)
        if ((arr.rows[0] === undefined)) {
            fs.readFile(`noUser.html`, 'utf8', function (err, description) {
            response.send(description);  
        });
        } else
        fs.readFile(`user.html`, 'utf8', function (err, description) {
            {
            var nowDate = moment().format("YYYY-MM-DD HH:mm");
            var endDate = moment().format("YYYYMMDDTHHmm");
            var startDate = moment().subtract(90,'d').format("YYYYMMDDTHHmm"); //최장 90일 이전 기록 탐색
            var ID = sanitizeHtml(arr.rows[0].playerId);
            requestAPI({url : 'https://api.neople.co.kr/cy/players/'+ID+'/matches?gameTypeId=normal&startDate='+startDate+'&endDate='+endDate+'&limit=100',headers:apiconfig},function (err, res, normalMatch) {
                    if (err) throw error;
                    requestAPI({url : 'https://api.neople.co.kr/cy/players/'+ID+'/matches?gameTypeId=rating&startDate='+startDate+'&endDate='+endDate+'&limit=100',headers:apiconfig},function (err, res, ratingMatch) {
                            if (err) throw error;
                            var normalMatchAry =JSON.parse(normalMatch);
                            var ratingMatchAry =JSON.parse(ratingMatch);
                            response.send(ejs.render(description, {normal:normalMatchAry ,rating :ratingMatchAry,nowDate : nowDate }));       
                        });
                    });
                }
            });
        });
    }


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
        var buildSqlTemp = 'SELECT * FROM builddetail WHERE `characterName` = ?';
        var buildSql = mysql.format(buildSqlTemp,cleanTitle);
        db.query(charSql+buildSql, function (err, rows) {
            requestAPI({url: 'https://api.neople.co.kr/cy/ranking/characters/' + rows[0][0].charID+'/winRate',headers:apiconfig}, function (err, res, body) {
            response.send(ejs.render(description,
              { pageName: cleanTitle,charInfo : rows[0], build: rows[1],ranking : JSON.parse(body)}));
          });
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
        var buildSql = 'SELECT * FROM builddetail WHERE `characterName` = '+mysql.escape(cleanTitle)+' AND position = '+mysql.escape(cleanPosition)+' ';
          db.query(charSql+buildSql, function (err, rows) {
            requestAPI({url: 'https://api.neople.co.kr/cy/ranking/characters/' + rows[0][0].charID+'/winRate',headers:apiconfig}, function (err, res, body) {
          response.send(ejs.render(description,
            { pageName: cleanTitle,charInfo : rows[0], build: rows[1],ranking : JSON.parse(body)}));
        });
        });
      });
    }

    
exports.ranking =  function(request, response){
    fs.readFile(`ranking.html`, 'utf8', function (err, description) {
        if (err)  next(err);
        requestAPI({url: 'https://api.neople.co.kr/cy/ranking/ratingpoint?limit=1000',headers:apiconfig}, function (err, res, body) {
            response.send(ejs.render(description,{ ranking : JSON.parse(body)}));
          });
        });
    }
