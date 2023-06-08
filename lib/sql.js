var dbconfig = require('../config/database.js');
var apiconfig = require('../config/api_key.js');
const express = require('express');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var moment = require('moment');
var mysql = require('mysql');
var sanitizeHtml = require('sanitize-html');

var requestAPI = require('request');

var cookie = require('cookie');
Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

exports.match = function (request, response) {
    var matchID = request.query.data;
    requestAPI({ url: 'https://api.neople.co.kr/cy/matches/' + matchID, headers: apiconfig }, function (err, res, body) {
        var arr = JSON.parse(body)
        response.send({ result: arr });
    });
};
exports.user = function (request, response) {
    var nickname = sanitizeHtml(request.query.userName);
    var regExp = /[~!@\#$%^&*\()\_']/gi;
    var t = nickname.replace(regExp, "");
    nickname = t;
    var normalChar = {}, normalCharWin = {}, normalKill = {}, normalDeath = {}, normalAssist = {}, normalPosi = {}, normalPosiWin = {}, normalParty = {}, normalPartyWin = {}, normalPosiKill = {}, normalPosiDeath = {}, normalPosiAssist = {};
    var normalCharPlaytime = {}, normalCharDeal = {}, normalDameged = {}, normalSight = {}, normalBattlePoint = {}, normalPosiPlaytime = {}, normalPosiDeal = {}, normalPosiDameged = {}, normalPosiSight = {}, normalPosiBattlePoint = {};
    var ratingChar = {}, ratingCharWin = {}, ratingKill = {}, ratingDeath = {}, ratingAssist = {}, ratingPosi = {}, ratingPosiWin = {}, ratingParty = {}, ratingPartyWin = {}, ratingPosiKill = {}, ratingPosiDeath = {}, ratingPosiAssist = {};
    var ratingCharPlaytime = {}, ratingCharDeal = {}, ratingDameged = {}, ratingSight = {}, ratingBattlePoint = {}, ratingPosiPlaytime = {}, ratingPosiDeal = {}, ratingPosiDameged = {}, ratingPosiSight = {}, ratingPosiBattlePoint = {};
    var hashtag=[];
    var normalFriends={},normalFriendsWin={},ratingFriends={},ratingFriendsWin={};

    
    requestAPI({ url: 'https://api.neople.co.kr/cy/players?nickname=' + encodeURI(nickname), headers: apiconfig }, function (err, res, body) {
        if (err) console.log(err);

        if (res.statusCode != 200) {
            fs.readFile('noUser.html', 'utf8', function (err, description) {
                response.send(description);
            })
        }
        else {
            var arr = JSON.parse(body)
            if ((arr.rows[0] === undefined)) {
                fs.readFile('noUser.html', 'utf8', function (err, description) {
                    response.send(description);
                });
            } else
                fs.readFile('user.html', 'utf8', function (err, description) {
                    {
                        var nowDate = moment().format("YYYY-MM-DD HH:mm");
                        var endDate = moment().format("YYYYMMDDTHHmm");
                        var startDate = moment().subtract(89, 'd').format("YYYYMMDDTHHmm"); //최장 90일 이전 기록 탐색
                        var ID = sanitizeHtml(arr.rows[0].playerId);
                        var timeTableTrack = Array.matrix(7, 24, 0);
        
                        requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=normal&startDate=' + startDate + '&endDate=' + endDate + '&limit=100', headers: apiconfig }, function (err, res, normalMatch) {
                            if (res.statusCode != 200) { 
                                fs.readFile('contact.html', 'utf8', function (err, description) {
                                    console.log(err);
                                    response.send(description);
                                })
                             }
                            requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=rating&startDate=' + startDate + '&endDate=' + endDate + '&limit=100', headers: apiconfig }, function (err, res, ratingMatch) {
                                if (res.statusCode != 200) {    
                                    fs.readFile('contact.html', 'utf8', function (err, description) {
                                    console.log(err);
                                    response.send(description);
                                }) }
                                if (err) throw error;
                               
                                var normalMatchAry = JSON.parse(normalMatch);
                                var ratingMatchAry = JSON.parse(ratingMatch);
                                    try{
                                    //일반전 캐릭 빈도별 승률계산
                                        for (var i = 0; i < normalMatchAry.matches.rows.length; i++) {
                                            var dateTemp = new Date(normalMatchAry.matches.rows[i].date);                                    
                                            timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1;
                                            if (normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] === undefined) {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                }
                                                else {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 0;
                                                }
                                                normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                            
                                            }
                                            else {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                }
                                                normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName]  += normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        
                                            }

                                            //일반전 포지션 빈도별 승률계산
                                            if (normalPosi[normalMatchAry.matches.rows[i].position.name] === undefined) {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 1;
                                                }
                                                else { normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 0; }
                                                normalPosi[normalMatchAry.matches.rows[i].position.name] = 1;
                                                normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalPosiDeal[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalPosiDameged[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalPosiSight[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                normalPosiKill[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalPosiDeath[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalPosiAssist[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            else {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalPosiWin[normalMatchAry.matches.rows[i].position.name]++;
                                                }
                                                normalPosi[normalMatchAry.matches.rows[i].position.name]++;
                                                normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                normalPosiDeal[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalPosiDameged[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalPosiSight[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                normalPosiKill[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalPosiDeath[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalPosiAssist[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            //일반전 인원 빈도별 승률계산
                                            if (normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                                else { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                            }
                                            else {
                                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++ }
                                            }


                                            //일반전 친구계산
                                            for (var j = 0; j < normalMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                            if (normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                else { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                            }
                                            else {
                                                normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                            }}


                                            }
                                            var sortable = [];
                                            for (var vehicle in normalChar) { sortable.push([vehicle, normalChar[vehicle], normalCharWin[vehicle], normalKill[vehicle], normalDeath[vehicle], normalAssist[vehicle]
                                                , normalCharPlaytime[vehicle], normalCharDeal[vehicle], normalDameged[vehicle], normalSight[vehicle], normalBattlePoint[vehicle]]); }
                                            sortable.sort(function (a, b) { return b[1] - a[1]; });

                                            var normalPartySort = [];
                                            for (var vehicle in normalParty) { normalPartySort.push([vehicle, normalParty[vehicle], normalPartyWin[vehicle]]); }

                                            var normalFriendsSort = [];
                                            for (var vehicle in normalFriends) { normalFriendsSort.push([vehicle, normalFriends[vehicle], normalFriendsWin[vehicle]]); }
                                            normalFriendsSort.sort(function (a, b) { return b[1] - a[1]; });


                                            var normalPosiSort = [];
                                            for (var vehicle in normalPosi) { normalPosiSort.push([vehicle, normalPosi[vehicle], normalPosiWin[vehicle],  normalPosiKill[vehicle]  ,normalPosiDeath[vehicle]  ,normalPosiAssist[vehicle]
                                                , normalPosiPlaytime[vehicle], normalPosiDeal[vehicle], normalPosiDameged[vehicle], normalPosiSight[vehicle], normalPosiBattlePoint[vehicle]]); }
                                            normalPosiSort.sort(function (a, b) { return b[1] - a[1]; });
                                    
                                    //경쟁전 캐릭 빈도별 승률계산
                                
                                    for (var i = 0; i < ratingMatchAry.matches.rows.length; i++) {
                                        var dateTemp = new Date(ratingMatchAry.matches.rows[i].date);                                    
                                        timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1

                                        if (ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] === undefined) {                                            
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                            }
                                            else { ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 0; }
                                            ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                            ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        
                                        
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                            }
                                            ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                            ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName]  += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        
                                        }

                                        //경쟁전 포지션 빈도별 승률계산
                                        if (ratingPosi[ratingMatchAry.matches.rows[i].position.name] === undefined) {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            }
                                            else { ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 0; }
                                            ratingPosi[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]++;
                                            }
                                            ratingPosi[ratingMatchAry.matches.rows[i].position.name]++;
                                            ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                            ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                        }

                                        //경쟁전 인원 빈도별 승률계산
                                        if (ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                            else { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                            ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++; }
                                            ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                        }
                                        //경쟁전 친구계산
                                        for (var j = 0; j < ratingMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                            if (ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                else { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                            }
                                            else {
                                                ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                            }}

                                    }
                                    var ratingSortable = [];
                                    for (var vehicle in ratingChar) { ratingSortable.push([vehicle, ratingChar[vehicle], ratingCharWin[vehicle], ratingKill[vehicle], ratingDeath[vehicle], ratingAssist[vehicle]
                                        , ratingCharPlaytime[vehicle], ratingCharDeal[vehicle], ratingDameged[vehicle], ratingSight[vehicle], ratingBattlePoint[vehicle]]); }
                                    ratingSortable.sort(function (a, b) { return b[1] - a[1]; });

                                    var ratingPartySort = [];
                                    for (var vehicle in ratingParty) { ratingPartySort.push([vehicle, ratingParty[vehicle], ratingPartyWin[vehicle]]); }

                                    var ratingFriendsSort = [];
                                    for (var vehicle in ratingFriends) { ratingFriendsSort.push([vehicle, ratingFriends[vehicle], ratingFriendsWin[vehicle]]); }
                                    ratingFriendsSort.sort(function (a, b) { return b[1] - a[1]; });


                                    var ratingPosiSort = [];
                                    for (var vehicle in ratingPosi) { ratingPosiSort.push([vehicle, ratingPosi[vehicle], ratingPosiWin[vehicle],  ratingPosiKill[vehicle]  ,ratingPosiDeath[vehicle]  ,ratingPosiAssist[vehicle]  ,
                                    ratingPosiPlaytime[vehicle], ratingPosiDeal[vehicle], ratingPosiDameged[vehicle], ratingPosiSight[vehicle], ratingPosiBattlePoint[vehicle]]); }
                                    ratingPosiSort.sort(function (a, b) { return b[1] - a[1]; });

                                    //해쉬태그 업적 조사 
                                    if(normalMatchAry.matches.rows.length>50){hashtag.push("일반전 선호")};
                                    if(ratingMatchAry.matches.rows.length>50){hashtag.push("공식전 선호")};
                                    if(normalMatchAry.matches.rows.length>10&&normalPosiSort[0][1]>30){hashtag.push(normalPosiSort[0][0])};
                                    if(ratingMatchAry.matches.rows.length>10&&ratingPosiSort[0][1]>30){hashtag.push(ratingPosiSort[0][0])};
                                    var uniq = hashtag.reduce(function(a,b){
                                        if (a.indexOf(b) < 0 ) a.push(b);
                                        return a;
                                    },[]);                          
                                    response.send(ejs.render(description, {
                                        normal: normalMatchAry, rating: ratingMatchAry, nowDate: nowDate,
                                        normalChar: sortable, ratingChar: ratingSortable, normalPosi: normalPosiSort,normalFriends : normalFriendsSort, ratingPosi: ratingPosiSort,
                                        normalParty: normalPartySort, ratingParty: ratingPartySort,hashtag : uniq,ratingFriends : ratingFriendsSort, timeTableRaw : timeTableTrack
                                    }));  
                               
                            }catch(err){
                                    fs.readFile('contact.html', 'utf8', function (err, description) {
                                        response.send(description);
                                    })
                                }
                            });
                        });
                    }
                });
        }
    });
   
}
function decodeUnicode(unicodeString) {
	var r = /\\u([\d\w]{4})/gi;
	unicodeString = unicodeString.replace(r, function (match, grp) {
	    return String.fromCharCode(parseInt(grp, 16)); } );
	return unescape(unicodeString);
}
exports.index = function (request, response) {
    fs.readFile('index.html', 'utf8', function (err, description) {
        response.send(ejs.render(description));
    });

}

exports.statistic = function (request, response) {
    fs.readFile('statistic.html', 'utf8', function (err, description) {
        if (err) next(err);
        var buildSql = 'SELECT * FROM combi ;';
        var attriSql = 'SELECT * FROM attri';
        db.query(buildSql + attriSql, function (err, rows) {
            response.send(ejs.render(description,
                { combi: rows[0], attri: rows[1] }));
        });
    });
}

exports.character = function (request, response) {
    fs.readFile('list.html', 'utf8', function (err, description) {
        if (err) next(err);
        var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
        var cleanTitle = sanitizeHtml(title);

        var charSqlTemp = "SELECT * FROM positioninfo WHERE 'character' = ? ;";
        var charSql = mysql.format(charSqlTemp, cleanTitle);
        var buildSqlTemp = "SELECT * FROM builddetail WHERE 'characterName' = ?";
        var buildSql = mysql.format(buildSqlTemp, cleanTitle);
        db.query(charSql + buildSql, function (err, rows) {
            if (rows[0] == undefined || rows[0].length == 0) {
                fs.readFile('contact.html', 'utf8', function (err, description) {
                    response.send(description);
                });
            } else {
                requestAPI({ url: 'https://api.neople.co.kr/cy/ranking/characters/' + rows[0][0].charID + '/winRate', headers: apiconfig }, function (err, res, body) {
                    if (err) {    
                        fs.readFile('contact.html', 'utf8', function (err, description) {
                        response.send(description);
                    })};
                    response.send(ejs.render(description,
                        { pageName: cleanTitle, charInfo: rows[0], build: rows[1], ranking: JSON.parse(body) }));
                });
            }
        });
    });
}

exports.position = function (request, response) {
    fs.readFile('list.html', 'utf8', function (err, description) {
        if (err) next(err);
        var title = path.basename(request.params.characterId, path.extname(request.params.characterId));
        var cleanTitle = sanitizeHtml(title);

        var cleanPosition = sanitizeHtml(request.params.position);
        var charSql = "SELECT * FROM positioninfo WHERE 'character' = ' + mysql.escape(cleanTitle) + ';";
        var buildSql = "SELECT * FROM builddetail WHERE 'characterName' = ' + mysql.escape(cleanTitle) + ' AND position = ' + mysql.escape(cleanPosition) + ' ";
        db.query(charSql + buildSql, function (err, rows) {
            if (rows[0][0] == undefined || rows[1][0] == undefined || rows[0].length == 0) {
                fs.readFile('contact.html', 'utf8', function (err, description) {
                    response.send(description);
                });
            } else {
                requestAPI({ url: 'https://api.neople.co.kr/cy/ranking/characters/' + rows[0][0].charID + '/winRate', headers: apiconfig }, function (err, res, body) {
                    if (res.statusCode != 200)  {    
                        fs.readFile('contact.html', 'utf8', function (err, description) {
                        response.send(description);
                    })};
                    response.send(ejs.render(description,
                        { pageName: cleanTitle, charInfo: rows[0], build: rows[1], ranking: JSON.parse(body) }));
                });
            }
        });
    });
}


exports.ranking = function (request, response) {
    fs.readFile('ranking.html', 'utf8', function (err, description) {
        if (err) next(err);
        requestAPI({ url: 'https://api.neople.co.kr/cy/ranking/ratingpoint?limit=1000', headers: apiconfig }, function (err, res, body) {
            if (res.statusCode != 200) {   fs.readFile('contact.html', 'utf8', function (err, description) {
                response.send(description);
            }) }
            response.send(ejs.render(description, { ranking: JSON.parse(body) }));
        });
    });
}


exports.vs = function (request, response) {
    var nicknameA = sanitizeHtml(request.query.userNameA);
    var regExp = /[~!@\#$%^&*\()\_']/gi;
    var t = nicknameA.replace(regExp, "");
    nicknameA = t;

    var nicknameB = sanitizeHtml(request.query.userNameB);
    var regExp = /[~!@\#$%^&*\()\_']/gi;
    var t = nicknameB.replace(regExp, "");
    nicknameB = t;

    var normalChar = {}, normalCharWin = {}, normalKill = {}, normalDeath = {}, normalAssist = {}, normalPosi = {}, normalPosiWin = {}, normalParty = {}, normalPartyWin = {}, normalPosiKill = {}, normalPosiDeath = {}, normalPosiAssist = {};
    var normalCharPlaytime = {}, normalCharDeal = {}, normalDameged = {}, normalSight = {}, normalBattlePoint = {}, normalPosiPlaytime = {}, normalPosiDeal = {}, normalPosiDameged = {}, normalPosiSight = {}, normalPosiBattlePoint = {};
    var ratingChar = {}, ratingCharWin = {}, ratingKill = {}, ratingDeath = {}, ratingAssist = {}, ratingPosi = {}, ratingPosiWin = {}, ratingParty = {}, ratingPartyWin = {}, ratingPosiKill = {}, ratingPosiDeath = {}, ratingPosiAssist = {};
    var ratingCharPlaytime = {}, ratingCharDeal = {}, ratingDameged = {}, ratingSight = {}, ratingBattlePoint = {}, ratingPosiPlaytime = {}, ratingPosiDeal = {}, ratingPosiDameged = {}, ratingPosiSight = {}, ratingPosiBattlePoint = {};
    var hashtag=[];
    var normalFriends={},normalFriendsWin={},ratingFriends={},ratingFriendsWin={};
    var totalChar = {}, totalCharWin = {}, totalKill = {}, totalDeath = {}, totalAssist = {}, totalPosi = {}, totalPosiWin = {}, totalParty = {}, totalPartyWin = {}, totalPosiKill = {}, totalPosiDeath = {}, totalPosiAssist = {};
    var totalCharPlaytime = {}, totalCharDeal = {}, totalDameged = {}, totalSight = {}, totalBattlePoint = {}, totalPosiPlaytime = {}, totalPosiDeal = {}, totalPosiDameged = {}, totalPosiSight = {}, totalPosiBattlePoint = {};var totalFriends={},totalFriendsWin={}


    requestAPI({ url: 'https://api.neople.co.kr/cy/players?nickname=' + encodeURI(nicknameA), headers: apiconfig }, function (err, res, body) {
        if (err) console.log(err);

        if (res.statusCode != 200) {
            fs.readFile('noUser.html', 'utf8', function (err, description) {
                response.send(description);
            })
        }
        else {
            var arr = JSON.parse(body)
            if ((arr.rows[0] === undefined)) {
                fs.readFile('noUser.html', 'utf8', function (err, description) {
                    response.send(description);
                });
            } else
                fs.readFile('vs.html', 'utf8', function (err, description) {
                    {
                        var nowDate = moment().format("YYYY-MM-DD HH:mm");
                        var endDate = moment().format("YYYYMMDDTHHmm");
                        var startDate = moment().subtract(89, 'd').format("YYYYMMDDTHHmm"); //최장 90일 이전 기록 탐색
                        var ID = sanitizeHtml(arr.rows[0].playerId);
                        var timeTableTrackA = Array.matrix(7, 24, 0);
                        var timeTableTrack = Array.matrix(7, 24, 0);
        
                        requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=normal&startDate=' + startDate + '&endDate=' + endDate + '&limit=1000', headers: apiconfig }, function (err, res, normalMatch) {
                            if (res.statusCode != 200) { 
                                fs.readFile('contact.html', 'utf8', function (err, description) {
                                    console.log(err);
                                    response.send(description);
                                })
                             }
                            requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=rating&startDate=' + startDate + '&endDate=' + endDate + '&limit=1000', headers: apiconfig }, function (err, res, ratingMatch) {
                                if (res.statusCode != 200) {    
                                    fs.readFile('contact.html', 'utf8', function (err, description) {
                                    console.log(err);
                                    response.send(description);
                                }) }
                                if (err) throw error;
                               
                                var normalMatchAry = JSON.parse(normalMatch);
                                var ratingMatchAry = JSON.parse(ratingMatch);
                                normalTotalGameA = normalMatchAry.matches.rows.length
                                normalTotalPlaytimeA = 0                
                                normalTotalDealA= 0
                                normalTotalDamegedA = 0
                                normalTotalSightA= 0
                                normalTotalBattlePointA= 0
                                normalTotalKillA= 0
                                normalTotalDeathA= 0
                                normalTotalAssistA= 0
                                normalTotalWinA =0
                                ratingTotalGameA = ratingMatchAry.matches.rows.length
                                ratingTotalPlaytimeA = 0                
                                ratingTotalDealA= 0
                                ratingTotalDamegedA = 0
                                ratingTotalSightA= 0
                                ratingTotalBattlePointA= 0
                                ratingTotalKillA= 0
                                ratingTotalDeathA= 0
                                ratingTotalAssistA= 0
                                ratingTotalWinA =0
                               
                                    //일반전 캐릭 빈도별 승률계산
                                        for (var i = 0; i < normalMatchAry.matches.rows.length; i++) {
                                            var dateTemp = new Date(normalMatchAry.matches.rows[i].date);                                    
                                            timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1;
                                            if (normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] === undefined) {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                    normalTotalWinA++;
                                                }
                                                else {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 0;
                                                }
                                                normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                            
                                            }
                                            else {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                    normalTotalWinA++
                                                }
                                                normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName]  += normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        
                                            }

                                            //일반전 포지션 빈도별 승률계산
                                            if (normalPosi[normalMatchAry.matches.rows[i].position.name] === undefined) {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 1;
                                                }
                                                else { normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 0; }
                                                normalPosi[normalMatchAry.matches.rows[i].position.name] = 1;
                                                normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                normalPosiDeal[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalPosiDameged[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalPosiSight[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                normalPosiKill[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalPosiDeath[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalPosiAssist[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            else {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    normalPosiWin[normalMatchAry.matches.rows[i].position.name]++;
                                                }
                                                normalPosi[normalMatchAry.matches.rows[i].position.name]++;
                                                normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                normalPosiDeal[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                normalPosiDameged[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                normalPosiSight[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                normalPosiKill[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                normalPosiDeath[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                normalPosiAssist[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            //일반전 인원 빈도별 승률계산
                                            if (normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                                else { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                            }
                                            else {
                                                normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++ }
                                            }
                                            //Total 계산
                                            if (totalPosi[normalMatchAry.matches.rows[i].position.name] === undefined) {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    totalPosiWin[normalMatchAry.matches.rows[i].position.name] = 1;
                                                }
                                                else { totalPosiWin[normalMatchAry.matches.rows[i].position.name] = 0; }
                                                totalPosi[normalMatchAry.matches.rows[i].position.name] = 1;
                                                totalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                totalPosiDeal[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                totalPosiDameged[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                totalPosiSight[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                totalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                totalPosiKill[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                totalPosiDeath[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                totalPosiAssist[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            else {
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                    totalPosiWin[normalMatchAry.matches.rows[i].position.name]++;
                                                }
                                                totalPosi[normalMatchAry.matches.rows[i].position.name]++;
                                                totalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                totalPosiDeal[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                totalPosiDameged[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                totalPosiSight[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                totalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                totalPosiKill[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                totalPosiDeath[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                totalPosiAssist[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            }
                                            normalTotalPlaytimeA += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                            normalTotalDealA += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                            normalTotalDamegedA += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                            normalTotalSightA += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                            normalTotalBattlePointA += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                            normalTotalKillA += normalMatchAry.matches.rows[i].playInfo.killCount;
                                            normalTotalDeathA += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                            normalTotalAssistA += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                            //일반전 친구계산
                                            for (var j = 0; j < normalMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                            if (normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                else { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                            }
                                            else {
                                                normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                            }}


                                            }
                                           
                                            var sortable = [];
                                            for (var vehicle in normalChar) { sortable.push([vehicle, normalChar[vehicle], normalCharWin[vehicle], normalKill[vehicle], normalDeath[vehicle], normalAssist[vehicle]
                                                , normalCharPlaytime[vehicle], normalCharDeal[vehicle], normalDameged[vehicle], normalSight[vehicle], normalBattlePoint[vehicle]]); }
                                            sortable.sort(function (a, b) { return b[1] - a[1]; });

                                            var normalPartySort = [];
                                            for (var vehicle in normalParty) { normalPartySort.push([vehicle, normalParty[vehicle], normalPartyWin[vehicle]]); }

                                            var normalFriendsSort = [];
                                            for (var vehicle in normalFriends) { normalFriendsSort.push([vehicle, normalFriends[vehicle], normalFriendsWin[vehicle]]); }
                                            normalFriendsSort.sort(function (a, b) { return b[1] - a[1]; });


                                            var normalPosiSort = [];
                                            for (var vehicle in normalPosi) { normalPosiSort.push([vehicle, normalPosi[vehicle], normalPosiWin[vehicle],  normalPosiKill[vehicle]  ,normalPosiDeath[vehicle]  ,normalPosiAssist[vehicle]
                                                , normalPosiPlaytime[vehicle], normalPosiDeal[vehicle], normalPosiDameged[vehicle], normalPosiSight[vehicle], normalPosiBattlePoint[vehicle]]); }
                                            normalPosiSort.sort(function (a, b) { return b[1] - a[1]; });
                                    
                                    //경쟁전 캐릭 빈도별 승률계산
                                          
                                
                                    for (var i = 0; i < ratingMatchAry.matches.rows.length; i++) {
                                        var dateTemp = new Date(ratingMatchAry.matches.rows[i].date);                                    
                                        timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1

                                        if (ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] === undefined) {                                            
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                ratingTotalWinA++
                                            }
                                            else { ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 0; }
                                            ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                            ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        
                                        
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                                ratingTotalWinA++;
                                            }
                                            ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                            ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName]  += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        
                                        }

                                        //경쟁전 포지션 빈도별 승률계산
                                        if (ratingPosi[ratingMatchAry.matches.rows[i].position.name] === undefined) {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            }
                                            else { ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 0; }
                                            ratingPosi[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                            ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]++;
                                            }
                                            ratingPosi[ratingMatchAry.matches.rows[i].position.name]++;
                                            ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                            ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                        }
                                        //Total 계산
                                        if (totalPosi[ratingMatchAry.matches.rows[i].position.name] === undefined) {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                totalPosiWin[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            }
                                            else { totalPosiWin[ratingMatchAry.matches.rows[i].position.name] = 0; }
                                            totalPosi[ratingMatchAry.matches.rows[i].position.name] = 1;
                                            totalPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                            totalPosiDeal[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            totalPosiDameged[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            totalPosiSight[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            totalPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                            totalPosiKill[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            totalPosiDeath[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            totalPosiAssist[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                totalPosiWin[ratingMatchAry.matches.rows[i].position.name]++;
                                            }
                                            totalPosi[ratingMatchAry.matches.rows[i].position.name]++;
                                            totalPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.playTime;                   
                                            totalPosiDeal[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                            totalPosiDameged[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                            totalPosiSight[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                            totalPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                            totalPosiKill[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                            totalPosiDeath[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                            totalPosiAssist[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                        }
                                                                            
                                        ratingTotalPlaytimeA += ratingMatchAry.matches.rows[i].playInfo.playTime;                   
                                        ratingTotalDealA += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                        ratingTotalDamegedA += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                        ratingTotalSightA += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                        ratingTotalBattlePointA += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                        ratingTotalKillA += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                        ratingTotalDeathA += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                        ratingTotalAssistA += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                        //경쟁전 인원 빈도별 승률계산
                                        if (ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                            else { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                            ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                        }
                                        else {
                                            if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++; }
                                            ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                        }
                                        //경쟁전 친구계산
                                        for (var j = 0; j < ratingMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                            if (ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                else { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                            }
                                            else {
                                                ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                            }}

                                    }
                                    var ratingSortable = [];
                                    for (var vehicle in ratingChar) { ratingSortable.push([vehicle, ratingChar[vehicle], ratingCharWin[vehicle], ratingKill[vehicle], ratingDeath[vehicle], ratingAssist[vehicle]
                                        , ratingCharPlaytime[vehicle], ratingCharDeal[vehicle], ratingDameged[vehicle], ratingSight[vehicle], ratingBattlePoint[vehicle]]); }
                                    ratingSortable.sort(function (a, b) { return b[1] - a[1]; });

                                    var ratingPartySort = [];
                                    for (var vehicle in ratingParty) { ratingPartySort.push([vehicle, ratingParty[vehicle], ratingPartyWin[vehicle]]); }

                                    var ratingFriendsSort = [];
                                    for (var vehicle in ratingFriends) { ratingFriendsSort.push([vehicle, ratingFriends[vehicle], ratingFriendsWin[vehicle]]); }
                                    ratingFriendsSort.sort(function (a, b) { return b[1] - a[1]; });


                                    var ratingPosiSort = [];
                                    for (var vehicle in ratingPosi) { ratingPosiSort.push([vehicle, ratingPosi[vehicle], ratingPosiWin[vehicle],  ratingPosiKill[vehicle]  ,ratingPosiDeath[vehicle]  ,ratingPosiAssist[vehicle]  ,
                                    ratingPosiPlaytime[vehicle], ratingPosiDeal[vehicle], ratingPosiDameged[vehicle], ratingPosiSight[vehicle], ratingPosiBattlePoint[vehicle]]); }
                                    ratingPosiSort.sort(function (a, b) { return b[1] - a[1]; });
                                    
                                    var totalPosiSort = [];
                                    for (var vehicle in totalPosi) { totalPosiSort.push([vehicle, totalPosi[vehicle], totalPosiWin[vehicle],  totalPosiKill[vehicle]  ,totalPosiDeath[vehicle]  ,totalPosiAssist[vehicle]  ,
                                    totalPosiPlaytime[vehicle], totalPosiDeal[vehicle], totalPosiDameged[vehicle], totalPosiSight[vehicle], totalPosiBattlePoint[vehicle]]); }
                                    totalPosiSort.sort(function (a, b) { return b[1] - a[1]; });


                                    //해쉬태그 업적 조사 
                                    if(normalMatchAry.matches.rows.length>50){hashtag.push("일반전 선호")};
                                    if(ratingMatchAry.matches.rows.length>50){hashtag.push("공식전 선호")};
                                    if(normalMatchAry.matches.rows.length>10&&normalPosiSort[0][1]>30){hashtag.push(normalPosiSort[0][0])};
                                    if(ratingMatchAry.matches.rows.length>10&&ratingPosiSort[0][1]>30){hashtag.push(ratingPosiSort[0][0])};
                                    var uniq = hashtag.reduce(function(a,b){
                                        if (a.indexOf(b) < 0 ) a.push(b);
                                        return a;
                                    },[]);
                                    var totalPosiSortA = totalPosiSort,
                                    normalMatchAryA= normalMatchAry, 
                                    ratingMatchAryA= ratingMatchAry, 
                                    nowDateA= nowDate,
                                    sortableA= sortable, 
                                    ratingSortableA= ratingSortable,
                                    normalPosiSortA= normalPosiSort,
                                    normalFriendsSortA = normalFriendsSort, 
                                    ratingPosiSortA= ratingPosiSort,
                                    normalPartySortA= normalPartySort, 
                                    ratingPartySortA= ratingPartySort,
                                    uniqA = uniq,
                                    ratingFriendsSortA = ratingFriendsSort,
                                    timeTableTrackA = timeTableTrack
                                                        
                                   
                            requestAPI({ url: 'https://api.neople.co.kr/cy/players?nickname=' + encodeURI(nicknameB), headers: apiconfig }, function (err, res, body) {
                                if (err) console.log(err);
                        
                                if (res.statusCode != 200) {
                                    fs.readFile('noUser.html', 'utf8', function (err, description) {
                                        response.send(description);
                                    })
                                }
                                else {
                                    var arr = JSON.parse(body)
                                    if ((arr.rows[0] === undefined)) {
                                        fs.readFile('noUser.html', 'utf8', function (err, description) {
                                            response.send(description);
                                        });
                                    } else
                                        fs.readFile('vs.html', 'utf8', function (err, description) {
                                            {
                                                var nowDate = moment().format("YYYY-MM-DD HH:mm");
                                                var endDate = moment().format("YYYYMMDDTHHmm");
                                                var startDate = moment().subtract(89, 'd').format("YYYYMMDDTHHmm"); //최장 90일 이전 기록 탐색
                                                var ID = sanitizeHtml(arr.rows[0].playerId);
                                                var timeTableTrackB = Array.matrix(7, 24, 0);
                                                var timeTableTrack = Array.matrix(7, 24, 0);
                                                
                                                var normalChar = {}, normalCharWin = {}, normalKill = {}, normalDeath = {}, normalAssist = {}, normalPosi = {}, normalPosiWin = {}, normalParty = {}, normalPartyWin = {}, normalPosiKill = {}, normalPosiDeath = {}, normalPosiAssist = {};
                                                var normalCharPlaytime = {}, normalCharDeal = {}, normalDameged = {}, normalSight = {}, normalBattlePoint = {}, normalPosiPlaytime = {}, normalPosiDeal = {}, normalPosiDameged = {}, normalPosiSight = {}, normalPosiBattlePoint = {};
                                                var ratingChar = {}, ratingCharWin = {}, ratingKill = {}, ratingDeath = {}, ratingAssist = {}, ratingPosi = {}, ratingPosiWin = {}, ratingParty = {}, ratingPartyWin = {}, ratingPosiKill = {}, ratingPosiDeath = {}, ratingPosiAssist = {};
                                                var ratingCharPlaytime = {}, ratingCharDeal = {}, ratingDameged = {}, ratingSight = {}, ratingBattlePoint = {}, ratingPosiPlaytime = {}, ratingPosiDeal = {}, ratingPosiDameged = {}, ratingPosiSight = {}, ratingPosiBattlePoint = {};
                                                
                                                var hashtag=[];
                                                var normalFriends={},normalFriendsWin={},ratingFriends={},ratingFriendsWin={};
                                                 
                                                var totalChar = {}, totalCharWin = {}, totalKill = {}, totalDeath = {}, totalAssist = {}, totalPosi = {}, totalPosiWin = {}, totalParty = {}, totalPartyWin = {}, totalPosiKill = {}, totalPosiDeath = {}, totalPosiAssist = {};
                                                var totalCharPlaytime = {}, totalCharDeal = {}, totalDameged = {}, totalSight = {}, totalBattlePoint = {}, totalPosiPlaytime = {}, totalPosiDeal = {}, totalPosiDameged = {}, totalPosiSight = {}, totalPosiBattlePoint = {};var totalFriends={},totalFriendsWin={}
            
                                                requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=normal&startDate=' + startDate + '&endDate=' + endDate + '&limit=1000', headers: apiconfig }, function (err, res, normalMatch) {
                                                    if (res.statusCode != 200) { 
                                                        fs.readFile('contact.html', 'utf8', function (err, description) {
                                                            console.log(err);
                                                            response.send(description);
                                                        })
                                                     }
                                                    requestAPI({ url: 'https://api.neople.co.kr/cy/players/' + ID + '/matches?gameTypeId=rating&startDate=' + startDate + '&endDate=' + endDate + '&limit=1000', headers: apiconfig }, function (err, res, ratingMatch) {
                                                        if (res.statusCode != 200) {    
                                                            fs.readFile('contact.html', 'utf8', function (err, description) {
                                                            console.log(err);
                                                            response.send(description);
                                                        }) }
                                                        if (err) throw error;
                                                       
                                                        var normalMatchAry = JSON.parse(normalMatch);
                                                        var ratingMatchAry = JSON.parse(ratingMatch);
                                                        normalTotalGameB = normalMatchAry.matches.rows.length
                                                        normalTotalPlaytimeB = 0                
                                                        normalTotalDealB= 0
                                                        normalTotalDamegedB = 0
                                                        normalTotalSightB= 0
                                                        normalTotalBattlePointB= 0
                                                        normalTotalKillB= 0
                                                        normalTotalDeathB= 0
                                                        normalTotalAssistB= 0
                                                        ratingTotalGameB = ratingMatchAry.matches.rows.length
                                                        ratingTotalPlaytimeB = 0                
                                                        ratingTotalDealB= 0
                                                        ratingTotalDamegedB = 0
                                                        ratingTotalSightB= 0
                                                        ratingTotalBattlePointB= 0
                                                        ratingTotalKillB= 0
                                                        ratingTotalDeathB= 0
                                                        ratingTotalAssistB= 0
                                                        normalTotalWinB =0
                                                        ratingTotalWinB =0
                                                                                
                                                            //일반전 캐릭 빈도별 승률계산
                                                                for (var i = 0; i < normalMatchAry.matches.rows.length; i++) {
                                                                    var dateTemp = new Date(normalMatchAry.matches.rows[i].date);                                    
                                                                    timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1;
                                                                    if (normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] === undefined) {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                                            normalTotalWinB++
                                                                        }
                                                                        else {
                                                                            normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName] = 0;
                                                                        }
                                                                        normalChar[normalMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                                        normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                        normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                                        normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                    
                                                                    }
                                                                    else {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            normalCharWin[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                                            normalTotalWinB++
                                                                            
                                                                        }
                                                                        normalChar[normalMatchAry.matches.rows[i].playInfo.characterName]++;
                                                                        normalKill[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        normalDeath[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        normalAssist[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                        normalCharPlaytime[normalMatchAry.matches.rows[i].playInfo.characterName]  += normalMatchAry.matches.rows[i].playInfo.playTime;
                                                                        normalCharDeal[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        normalDameged[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        normalSight[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        normalBattlePoint[normalMatchAry.matches.rows[i].playInfo.characterName] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                                                
                                                                    }
                                                                     //Total 계산                                      
                                                                    normalTotalPlaytimeB += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                                    normalTotalDealB += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    normalTotalDamegedB += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    normalTotalSightB += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    normalTotalBattlePointB += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                    normalTotalKillB += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                    normalTotalDeathB += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    normalTotalAssistB += normalMatchAry.matches.rows[i].playInfo.assistCount;
                        
                                                                    //일반전 포지션 빈도별 승률계산
                                                                    if (normalPosi[normalMatchAry.matches.rows[i].position.name] === undefined) {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 1;
                                                                        }
                                                                        else { normalPosiWin[normalMatchAry.matches.rows[i].position.name] = 0; }
                                                                        normalPosi[normalMatchAry.matches.rows[i].position.name] = 1;
                                                                        normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                                        normalPosiDeal[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        normalPosiDameged[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        normalPosiSight[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        normalPosiKill[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        normalPosiDeath[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        normalPosiAssist[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    }
                                                                    else {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            normalPosiWin[normalMatchAry.matches.rows[i].position.name]++;
                                                                        }
                                                                        normalPosi[normalMatchAry.matches.rows[i].position.name]++;
                                                                        normalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                                        normalPosiDeal[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        normalPosiDameged[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        normalPosiSight[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        normalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        normalPosiKill[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        normalPosiDeath[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        normalPosiAssist[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    }
                                                                    //Total 인포 계산
                                                                    if (totalPosi[normalMatchAry.matches.rows[i].position.name] === undefined) {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            totalPosiWin[normalMatchAry.matches.rows[i].position.name] = 1;
                                                                        }
                                                                        else { totalPosiWin[normalMatchAry.matches.rows[i].position.name] = 0; }
                                                                        totalPosi[normalMatchAry.matches.rows[i].position.name] = 1;
                                                                        totalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.playTime;
                                                                        totalPosiDeal[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        totalPosiDameged[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        totalPosiSight[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        totalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        totalPosiKill[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        totalPosiDeath[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        totalPosiAssist[normalMatchAry.matches.rows[i].position.name] = normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    }
                                                                    else {
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                            totalPosiWin[normalMatchAry.matches.rows[i].position.name]++;
                                                                        }
                                                                        totalPosi[normalMatchAry.matches.rows[i].position.name]++;
                                                                        totalPosiPlaytime[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.playTime;                   
                                                                        totalPosiDeal[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                        totalPosiDameged[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                        totalPosiSight[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                        totalPosiBattlePoint[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                        totalPosiKill[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.killCount;
                                                                        totalPosiDeath[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.deathCount;
                                                                        totalPosiAssist[normalMatchAry.matches.rows[i].position.name] += normalMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    }


                                                                    //일반전 인원 빈도별 승률계산
                                                                    if (normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                                                        normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                                                        else { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                                                    }
                                                                    else {
                                                                        normalParty[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalPartyWin[normalMatchAry.matches.rows[i].playInfo.partyUserCount]++ }
                                                                    }
                        
                        
                                                                    //일반전 친구계산
                                                                    for (var j = 0; j < normalMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                                                    if (normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                                        normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                                        else { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                                                    }
                                                                    else {
                                                                        normalFriends[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                                        if (normalMatchAry.matches.rows[i].playInfo.result == "win") { normalFriendsWin[normalMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                                                    }}


                        
                        
                                                                    }
                                                                    var sortable = [];
                                                                    for (var vehicle in normalChar) { sortable.push([vehicle, normalChar[vehicle], normalCharWin[vehicle], normalKill[vehicle], normalDeath[vehicle], normalAssist[vehicle]
                                                                        , normalCharPlaytime[vehicle], normalCharDeal[vehicle], normalDameged[vehicle], normalSight[vehicle], normalBattlePoint[vehicle]]); }
                                                                    sortable.sort(function (a, b) { return b[1] - a[1]; });
                        
                                                                    var normalPartySort = [];
                                                                    for (var vehicle in normalParty) { normalPartySort.push([vehicle, normalParty[vehicle], normalPartyWin[vehicle]]); }
                        
                                                                    var normalFriendsSort = [];
                                                                    for (var vehicle in normalFriends) { normalFriendsSort.push([vehicle, normalFriends[vehicle], normalFriendsWin[vehicle]]); }
                                                                    normalFriendsSort.sort(function (a, b) { return b[1] - a[1]; });
                        
                        
                                                                    var normalPosiSort = [];
                                                                    for (var vehicle in normalPosi) { normalPosiSort.push([vehicle, normalPosi[vehicle], normalPosiWin[vehicle],  normalPosiKill[vehicle]  ,normalPosiDeath[vehicle]  ,normalPosiAssist[vehicle]
                                                                        , normalPosiPlaytime[vehicle], normalPosiDeal[vehicle], normalPosiDameged[vehicle], normalPosiSight[vehicle], normalPosiBattlePoint[vehicle]]); }
                                                                    normalPosiSort.sort(function (a, b) { return b[1] - a[1]; });
                                                            
                                                            //경쟁전 캐릭 빈도별 승률계산
                                                        
                                                            for (var i = 0; i < ratingMatchAry.matches.rows.length; i++) {
                                                                var dateTemp = new Date(ratingMatchAry.matches.rows[i].date);                                    
                                                                timeTableTrack[dateTemp.getDay()][dateTemp.getHours()] +=1
                        
                                                                if (ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] === undefined) {                                            
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                                        ratingTotalWinB++
                                                                    }
                                                                    else { ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName] = 0; }
                                                                    ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName] = 1;
                                                                    ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                                                    ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                
                                                                
                                                                }
                                                                else {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        ratingCharWin[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                                                        ratingTotalWinB++
                                                                    }
                                                                    ratingChar[ratingMatchAry.matches.rows[i].playInfo.characterName]++;
                                                                    ratingKill[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    ratingDeath[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    ratingAssist[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    ratingCharPlaytime[ratingMatchAry.matches.rows[i].playInfo.characterName]  += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                                                    ratingCharDeal[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    ratingDameged[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    ratingSight[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    ratingBattlePoint[ratingMatchAry.matches.rows[i].playInfo.characterName] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                
                                                                }
                                                                ratingTotalPlaytimeB += ratingMatchAry.matches.rows[i].playInfo.playTime;                   
                                                                ratingTotalDealB += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                ratingTotalDamegedB += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                ratingTotalSightB += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                ratingTotalBattlePointB += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                ratingTotalKillB += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                ratingTotalDeathB += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                ratingTotalAssistB += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                        
                                                                //경쟁전 포지션 빈도별 승률계산
                                                                if (ratingPosi[ratingMatchAry.matches.rows[i].position.name] === undefined) {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 1;
                                                                    }
                                                                    else { ratingPosiWin[ratingMatchAry.matches.rows[i].position.name] = 0; }
                                                                    ratingPosi[ratingMatchAry.matches.rows[i].position.name] = 1;
                                                                    ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                    ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                                                    ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                }
                                                                else {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        ratingPosiWin[ratingMatchAry.matches.rows[i].position.name]++;
                                                                    }
                                                                    ratingPosi[ratingMatchAry.matches.rows[i].position.name]++;
                                                                    ratingPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.playTime;
                                                                    ratingPosiDeal[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    ratingPosiDameged[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    ratingPosiSight[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    ratingPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                    ratingPosiKill[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    ratingPosiDeath[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    ratingPosiAssist[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                }
                                                                if (totalPosi[ratingMatchAry.matches.rows[i].position.name] === undefined) {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        totalPosiWin[ratingMatchAry.matches.rows[i].position.name] = 1;
                                                                    }
                                                                    else { totalPosiWin[ratingMatchAry.matches.rows[i].position.name] = 0; }
                                                                    totalPosi[ratingMatchAry.matches.rows[i].position.name] = 1;
                                                                    totalPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.playTime;
                                                                    totalPosiDeal[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    totalPosiDameged[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    totalPosiSight[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    totalPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                    totalPosiKill[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    totalPosiDeath[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    totalPosiAssist[ratingMatchAry.matches.rows[i].position.name] = ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                }
                                                                else {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") {
                                                                        totalPosiWin[ratingMatchAry.matches.rows[i].position.name]++;
                                                                    }
                                                                    totalPosi[ratingMatchAry.matches.rows[i].position.name]++;
                                                                    totalPosiPlaytime[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.playTime;                   
                                                                    totalPosiDeal[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.attackPoint;
                                                                    totalPosiDameged[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.damagePoint;
                                                                    totalPosiSight[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.sightPoint;
                                                                    totalPosiBattlePoint[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.battlePoint;
                                                                    totalPosiKill[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.killCount;
                                                                    totalPosiDeath[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.deathCount;
                                                                    totalPosiAssist[ratingMatchAry.matches.rows[i].position.name] += ratingMatchAry.matches.rows[i].playInfo.assistCount;
                                                                }
                        
                                                                //경쟁전 인원 빈도별 승률계산
                                                                if (ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] === undefined) {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1; }
                                                                    else { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 0; }
                                                                    ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount] = 1;
                                                                }
                                                                else {
                                                                    if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingPartyWin[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++; }
                                                                    ratingParty[ratingMatchAry.matches.rows[i].playInfo.partyUserCount]++;
                                                                }
                                                                //경쟁전 친구계산
                                                                for (var j = 0; j < ratingMatchAry.matches.rows[i].playInfo.partyInfo.length; j++) {
                                                                    if (ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] === undefined) {
                                                                        ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1;
                                                                        if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 1; }
                                                                        else { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname] = 0; }
                                                                    }
                                                                    else {
                                                                        ratingFriends[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++;
                                                                        if (ratingMatchAry.matches.rows[i].playInfo.result == "win") { ratingFriendsWin[ratingMatchAry.matches.rows[i].playInfo.partyInfo[j].nickname]++ }
                                                                    }}
                        
                                                            }
                                                            var ratingSortable = [];
                                                            for (var vehicle in ratingChar) { ratingSortable.push([vehicle, ratingChar[vehicle], ratingCharWin[vehicle], ratingKill[vehicle], ratingDeath[vehicle], ratingAssist[vehicle]
                                                                , ratingCharPlaytime[vehicle], ratingCharDeal[vehicle], ratingDameged[vehicle], ratingSight[vehicle], ratingBattlePoint[vehicle]]); }
                                                            ratingSortable.sort(function (a, b) { return b[1] - a[1]; });
                        
                                                            var ratingPartySort = [];
                                                            for (var vehicle in ratingParty) { ratingPartySort.push([vehicle, ratingParty[vehicle], ratingPartyWin[vehicle]]); }
                        
                                                            var ratingFriendsSort = [];
                                                            for (var vehicle in ratingFriends) { ratingFriendsSort.push([vehicle, ratingFriends[vehicle], ratingFriendsWin[vehicle]]); }
                                                            ratingFriendsSort.sort(function (a, b) { return b[1] - a[1]; });
                        
                        
                                                            var ratingPosiSort = [];
                                                            for (var vehicle in ratingPosi) { ratingPosiSort.push([vehicle, ratingPosi[vehicle], ratingPosiWin[vehicle],  ratingPosiKill[vehicle]  ,ratingPosiDeath[vehicle]  ,ratingPosiAssist[vehicle]  ,
                                                            ratingPosiPlaytime[vehicle], ratingPosiDeal[vehicle], ratingPosiDameged[vehicle], ratingPosiSight[vehicle], ratingPosiBattlePoint[vehicle]]); }
                                                            ratingPosiSort.sort(function (a, b) { return b[1] - a[1]; });

                                                            var totalPosiSort = [];
                                                            for (var vehicle in totalPosi) { totalPosiSort.push([vehicle, totalPosi[vehicle], totalPosiWin[vehicle],  totalPosiKill[vehicle]  ,totalPosiDeath[vehicle]  ,totalPosiAssist[vehicle]  ,
                                                            totalPosiPlaytime[vehicle], totalPosiDeal[vehicle], totalPosiDameged[vehicle], totalPosiSight[vehicle], totalPosiBattlePoint[vehicle]]); }
                                                            totalPosiSort.sort(function (a, b) { return b[1] - a[1]; });
                        
                        
                                                            //해쉬태그 업적 조사 
                                                            if(normalMatchAry.matches.rows.length>50){hashtag.push("일반전 선호")};
                                                            if(ratingMatchAry.matches.rows.length>50){hashtag.push("공식전 선호")};
                                                            if(normalMatchAry.matches.rows.length>10&&normalPosiSort[0][1]>30){hashtag.push(normalPosiSort[0][0])};
                                                            if(ratingMatchAry.matches.rows.length>10&&ratingPosiSort[0][1]>30){hashtag.push(ratingPosiSort[0][0])};
                                                            var uniq = hashtag.reduce(function(a,b){
                                                                if (a.indexOf(b) < 0 ) a.push(b);
                                                                return a;
                                                            },[]);
                                                            var totalPosiSortB = totalPosiSort
                                                            normalMatchAryB= normalMatchAry, 
                                                            ratingMatchAryB= ratingMatchAry, 
                                                            nowDateB= nowDate,
                                                            sortableB= sortable, 
                                                            ratingSortableB= ratingSortable,
                                                            normalPosiSortB= normalPosiSort,
                                                            normalFriendsSortB = normalFriendsSort, 
                                                            ratingPosiSortB= ratingPosiSort,
                                                            normalPartySortB= normalPartySort, 
                                                            ratingPartySortB= ratingPartySort,
                                                            uniqB = uniq,
                                                            ratingFriendsSortB = ratingFriendsSort,
                                                            timeTableTrackB = timeTableTrack
                                                           
                                                            
                                                            response.send(ejs.render(description, {
                                                                normalA: normalMatchAryA, ratingA: ratingMatchAryA, nowDateA: nowDateA,
                                                                normalCharA: sortableA, ratingCharA: ratingSortableA, normalPosiA: normalPosiSortA,normalFriendsA : normalFriendsSortA, ratingPosiA: ratingPosiSortA,
                                                                normalPartyA: normalPartySortA, ratingPartyA: ratingPartySortA,hashtagA : uniqA,ratingFriendsA : ratingFriendsSortA, timeTableRawA : timeTableTrackA,
                                                                normalB: normalMatchAryB, ratingB: ratingMatchAryB, nowDateB: nowDateB,
                                                                normalCharB: sortableB, ratingCharB: ratingSortableB, normalPosiB: normalPosiSortB,normalFriendsB : normalFriendsSortB, ratingPosiB: ratingPosiSortB,
                                                                normalPartyB: normalPartySortB, ratingPartyB: ratingPartySortB,hashtagB : uniqB,ratingFriendsB : ratingFriendsSortB, timeTableRawB : timeTableTrackB,
                                                                normalTotalGameA : normalTotalGameA,
                                                                normalTotalPlaytimeA : normalTotalPlaytimeA,             
                                                                normalTotalDealA : normalTotalDealA,
                                                                normalTotalDamegedA : normalTotalDamegedA ,
                                                                normalTotalSightA : normalTotalSightA ,
                                                                normalTotalBattlePointA : normalTotalBattlePointA,
                                                                normalTotalKillA :  normalTotalKillA,
                                                                normalTotalDeathA : normalTotalDeathA ,
                                                                normalTotalAssistA : normalTotalAssistA ,   
                                                                normalTotalGameB : normalTotalGameB,
                                                                normalTotalPlaytimeB : normalTotalPlaytimeB,             
                                                                normalTotalDealB : normalTotalDealB,
                                                                normalTotalDamegedB : normalTotalDamegedB,
                                                                normalTotalSightB : normalTotalSightB ,
                                                                normalTotalBattlePointB : normalTotalBattlePointB,
                                                                normalTotalKillB :  normalTotalKillB,
                                                                normalTotalDeathB : normalTotalDeathB ,
                                                                normalTotalAssistB : normalTotalAssistB ,
                                                                ratingTotalGameA : ratingTotalGameA,
                                                                ratingTotalPlaytimeA : ratingTotalPlaytimeA,             
                                                                ratingTotalDealA : ratingTotalDealA,
                                                                ratingTotalDamegedA : ratingTotalDamegedA ,
                                                                ratingTotalSightA : ratingTotalSightA ,
                                                                ratingTotalBattlePointA : ratingTotalBattlePointA,
                                                                ratingTotalKillA :  ratingTotalKillA,
                                                                ratingTotalDeathA : ratingTotalDeathA ,
                                                                ratingTotalAssistA : ratingTotalAssistA ,   
                                                                ratingTotalGameB : ratingTotalGameB,
                                                                ratingTotalPlaytimeB : ratingTotalPlaytimeB,             
                                                                ratingTotalDealB : ratingTotalDealB,
                                                                ratingTotalDamegedB : ratingTotalDamegedB,
                                                                ratingTotalSightB : ratingTotalSightB ,
                                                                ratingTotalBattlePointB : ratingTotalBattlePointB,
                                                                ratingTotalKillB :  ratingTotalKillB,
                                                                ratingTotalDeathB : ratingTotalDeathB ,
                                                                ratingTotalAssistB : ratingTotalAssistB ,
                                                                ratingTotalWinA : ratingTotalWinA,
                                                                ratingTotalWinB : ratingTotalWinB,
                                                                normalTotalWinA : normalTotalWinA,
                                                                normalTotalWinB : normalTotalWinB,totalChar : totalChar,
                                                                totalPosiSortA : totalPosiSortA,
                                                                totalPosiSortB:totalPosiSortB
                                                            }));  
                                                       
                                                 
                                                    });
                                                });
                                            }
                                        });
                                }
                            });
                               
                          
                            });
                        });
                    }
                });
        }
    });
   
}