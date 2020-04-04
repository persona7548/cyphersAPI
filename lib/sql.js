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

exports.match = function (request, response) {
    var matchID =request.query.data;
    requestAPI({url: 'https://api.neople.co.kr/cy/matches/' +matchID,headers:apiconfig}, function (err, res, body) {
        var arr = JSON.parse(body)
        response.send({result:arr});
    });
};
exports.user = function (request, response) {  
    var nickname =sanitizeHtml(request.query.userName);
    var regExp = /[~!@\#$%^&*\()\-=+_']/gi;
    var t = nickname.replace(regExp, "");
    nickname = t;
    var normalChar={}, normalCharWin={}, normalKill={}, normalDeath={}, normalAssist={}, normalPosi={}, normalPosiWin={}, normalParty={}, normalPartyWin={};
    var ratingChar={}, ratingCharWin={}, ratingKill={}, ratingDeath={}, ratingAssist={}, ratingPosi={}, ratingPosiWin={}, ratingParty={}, ratingPartyWin={};
    requestAPI({url: 'https://api.neople.co.kr/cy/players?nickname=' +encodeURI(nickname),headers:apiconfig}, function (err, res, body) {
        if (err) next(err);
      
        if(res.statusCode!=200){
            fs.readFile(`noUser.html`, 'utf8', function (err, description) {
            response.send(description);  
        })}
        else{
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
                if(res.statusCode!=200){ next(err);}
                    requestAPI({url : 'https://api.neople.co.kr/cy/players/'+ID+'/matches?gameTypeId=rating&startDate='+startDate+'&endDate='+endDate+'&limit=100',headers:apiconfig},function (err, res, ratingMatch) {
                        if(res.statusCode!=200){ next(err);}
                            if (err) throw error;
                            var normalMatchAry =JSON.parse(normalMatch);
                            var ratingMatchAry =JSON.parse(ratingMatch);
                            //캐릭 빈도별 승률계산
                            for(var i=0 ; i<normalMatchAry.matches.rows.length ; i++){
                                if(normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]===undefined){
                                    if(normalMatchAry.matches.rows[i].playInfo.result=="win"){
                                        normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]=1;}
                                    else{
                                        normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]=0;}
                                    normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]=1;
                                    normalKill[normalMatchAry.matches.rows[i].playInfo.characterName]=normalMatchAry.matches.rows[i].playInfo.killCount;
                                    normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName]=normalMatchAry.matches.rows[i].playInfo.deathCount;
                                    normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName]=normalMatchAry.matches.rows[i].playInfo.assistCount;
                                }
                                else{
                                    if(normalMatchAry.matches.rows[i].playInfo.result=="win"){
                                        normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]++;}
                                    normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                    normalKill[normalMatchAry.matches.rows[i].playInfo.characterName]+=normalMatchAry.matches.rows[i].playInfo.killCount;
                                    normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName]+=normalMatchAry.matches.rows[i].playInfo.deathCount;
                                    normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName]+=normalMatchAry.matches.rows[i].playInfo.assistCount;}

                            //포지션 빈도별 승률계산
                                if(normalPosi[normalMatchAry.matches.rows[i].position.name]===undefined){
                                    if(normalMatchAry.matches.rows[i].playInfo.result=="win"){
                                        normalPosiWin[normalMatchAry.matches.rows[i].position.name]=1;}
                                        else{normalPosiWin[normalMatchAry.matches.rows[i].position.name]=0;}
                                        normalPosi[normalMatchAry.matches.rows[i].position.name]=1;}
                                else{
                                    if(normalMatchAry.matches.rows[i].playInfo.result=="win"){
                                        normalPosiWin[normalMatchAry.matches.rows[i].position.name]++;}
                                        normalPosi[normalMatchAry.matches.rows[i].position.name]++;}
                            //인원 빈도별 승률계산
                            if(normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]===undefined){
                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]=1;
                                if(normalMatchAry.matches.rows[i].playInfo.result=="win"){normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]=1;}
                                else{ normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]=0;}  }
                            else{
                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                if(normalMatchAry.matches.rows[i].playInfo.result=="win"){normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++}} }            
                            var sortable = [];
                            for (var vehicle in normalChar) {sortable.push([vehicle, normalChar[vehicle],normalCharWin[vehicle],normalKill[vehicle],normalDeath[vehicle],normalAssist[vehicle]]);}
                            sortable.sort(function(a, b) {return  b[1]- a[1];});  

                            var normalPartySort = [];
                            for (var vehicle in normalParty) {normalPartySort.push([vehicle, normalParty[vehicle],normalPartyWin[vehicle]]);}
                         
                            var normalPosiSort = [];
                            for (var vehicle in normalPosi) {normalPosiSort.push([vehicle, normalPosi[vehicle],normalPosiWin[vehicle]]);}
                            normalPosiSort.sort(function(a, b) {return  b[1]- a[1];});  
                
                            for(var i=0 ; i<ratingMatchAry.matches.rows.length ; i++){
                                if(ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]===undefined){
                                    if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){
                                        ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]=1;}
                                    else{ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]=0;}
                                    ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]=1;       
                                    ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName]=ratingMatchAry.matches.rows[i].playInfo.killCount;
                                    ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName]=ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                    ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName]=ratingMatchAry.matches.rows[i].playInfo.assistCount;}
                                else{
                                    if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){
                                        ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]++;}
                                    ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                    ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName]+=ratingMatchAry.matches.rows[i].playInfo.killCount;
                                    ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName]+=ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                    ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName]+=ratingMatchAry.matches.rows[i].playInfo.assistCount;}
                                 
                            //포지션 빈도별 승률계산
                                if(ratingPosi[ratingMatchAry.matches.rows[i].position.name]===undefined){
                                    if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){
                                        ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]=1;}
                                        else{ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]=0;}
                                        ratingPosi[ratingMatchAry.matches.rows[i].position.name]=1;}
                                    else{
                                        if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){
                                            ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]++;}
                                            ratingPosi[ratingMatchAry.matches.rows[i].position.name]++;}

                                 //인원 빈도별 승률계산
                                if(ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]===undefined){
                                    if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]=1;}
                                    else{ ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]=0;}  
                                    ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]=1;}
                                else{
                                    if(ratingMatchAry.matches.rows[i].playInfo.result=="win"){ ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++;}
                                    ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++;}
                                }
                                var ratingSortable = [];
                                for (var vehicle in ratingChar) {ratingSortable.push([vehicle, ratingChar[vehicle],ratingCharWin[vehicle],ratingKill[vehicle],ratingDeath[vehicle],ratingAssist[vehicle]]);}
                                ratingSortable.sort(function(a, b) {return  b[1]- a[1];});  

                                var ratingPartySort = [];
                                for (var vehicle in ratingParty) {ratingPartySort.push([vehicle, ratingParty[vehicle],ratingPartyWin[vehicle]]);}                           

                                var ratingPosiSort = [];
                                for (var vehicle in ratingPosi) {ratingPosiSort.push([vehicle, ratingPosi[vehicle],ratingPosiWin[vehicle]]);}
                                ratingPosiSort.sort(function(a, b) {return  b[1]- a[1];});  

                            response.send(ejs.render(description, {normal:normalMatchAry ,rating :ratingMatchAry,nowDate : nowDate,
                                normalChar:sortable,ratingChar :ratingSortable,normalPosi:normalPosiSort,ratingPosi:ratingPosiSort,
                                normalParty:normalPartySort ,ratingParty:ratingPartySort}));       
                        });
                    });
                }
            });}
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
        var buildSql = 'SELECT * FROM combi';
        db.query(buildSql, function (err, rows) {
          response.send(ejs.render(description,
            { combi: rows }));
        });
      });
    }

    
exports.ranking =  function(request, response){
    fs.readFile(`ranking.html`, 'utf8', function (err, description) {
        if (err)  next(err);
        requestAPI({url: 'https://api.neople.co.kr/cy/ranking/ratingpoint?limit=1000',headers:apiconfig}, function (err, res, body) {
            if(res.statusCode!=200){ next(err);}
            response.send(ejs.render(description,{ ranking : JSON.parse(body)}));
          });
        });
    }

exports.character = function(request, response){
    fs.readFile(`list.html`, 'utf8', function (err, description) {
        if (err) next(err);
        var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
        var cleanTitle = sanitizeHtml(title);
        var charSqlTemp = 'SELECT * FROM positioninfo WHERE `character` = ? ;';
        var charSql = mysql.format(charSqlTemp,cleanTitle);
        var buildSqlTemp = 'SELECT * FROM builddetail WHERE `characterName` = ?';
        var buildSql = mysql.format(buildSqlTemp,cleanTitle);
        db.query(charSql+buildSql, function (err, rows) {
            requestAPI({url: 'https://api.neople.co.kr/cy/ranking/characters/' +rows[0][0].charID+'/winRate',headers:apiconfig}, function (err, res, body) {
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
        var charSql = 'SELECT * FROM positioninfo WHERE `character` = ' + mysql.escape(cleanTitle) + ';';
        var buildSql = 'SELECT * FROM builddetail WHERE `characterName` = '+mysql.escape(cleanTitle)+' AND position = '+mysql.escape(cleanPosition)+' ';
          db.query(charSql+buildSql, function (err, rows) {
            requestAPI({url: 'https://api.neople.co.kr/cy/ranking/characters/' +rows[0][0].charID+'/winRate',headers:apiconfig}, function (err, res, body) {
          response.send(ejs.render(description,
            { pageName: cleanTitle,charInfo : rows[0], build: rows[1],ranking : JSON.parse(body)}));
        });
        });
      });
    }
