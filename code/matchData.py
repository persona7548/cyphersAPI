import requests
import time
import pandas
import json
import csv
headers = {'Content-Type': 'application/json; charset=utf-8','apikey' :'***********'}
equipment = list(["101","102","103","104","105","106","202","203","301","302","303","304","305","107","204","205"])

csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/matchId.csv',header=None,encoding='ANSI')
uniqCsvfile = csvfile.drop_duplicates()

for id in range(1,len(csvfile)):
    print(id)
    try:
        matchID = uniqCsvfile[0][id]
    except:
        continue
    time.sleep(0.05)
    url = 'https://api.neople.co.kr/cy/matches/'+matchID
    try:
        r = requests.get(url=url,headers = headers)
    except:
        time.sleep(1)
        id = id-1
        print(id," Pass")
        continue

    data = json.loads(r.text)
    map = str(data["players"][1]["map"]["mapId"])
    date = str(data["date"])

    if data["teams"][0]["result"] =="win":
        winList = data["teams"][0]["players"]
        loseList = data["teams"][1]["players"]
    else:
        winList = data["teams"][1]["players"]
        loseList = data["teams"][0]["players"]

    f = open('C:/Users/KTH/Desktop/GitHub/matchData.csv', 'a')
    #create win match record
    f.write("win,"+matchID+","+map)
    playerCount = data["players"]
    for i in range(len(playerCount)):
        player = playerCount[i]
        if player["playerId"] in winList:
            f.write(","+str(player["playInfo"]["characterId"]))
    f.write("\n")
    #create lose match record
    f.write("lose,"+matchID+","+map)
    playerCount = data["players"]
    for i in range(len(playerCount)):
        player = playerCount[i]
        if player["playerId"] in loseList:
            f.write(","+str(player["playInfo"]["characterId"]))
    f.write("\n")
    f.close()

#create detail match infomation
    f = open('C:/Users/KTH/Desktop/GitHub/matchInfo.csv', 'a')
    for i in range(len(playerCount)):
        player = data["players"][i]
        if player["playerId"] in winList:
            f.write(date+","+"win,"+map+",")
        else:
            f.write(date+","+"lose,"+map+",")
        f.write(matchID+","+player["playerId"]+","+str(player["playInfo"]["random"])+","+str(player["playInfo"]["partyUserCount"])+","+str(player["playInfo"]["partyId"])+","+str(player["playInfo"]["playTypeName"])
        +","+player["playInfo"]["characterId"]+","+str(player["playInfo"]["level"])
        +","+str(player["playInfo"]["killCount"])+","+str(player["playInfo"]["deathCount"])+","+str(player["playInfo"]["assistCount"])
        +","+str(player["playInfo"]["attackPoint"])+","+str(player["playInfo"]["damagePoint"])+","+str(player["playInfo"]["battlePoint"])
        +","+str(player["playInfo"]["sightPoint"]) +","+str(player["playInfo"]["towerAttackPoint"]) +","+str(player["playInfo"]["backAttackCount"]) +","+str(player["playInfo"]["comboCount"])
        +","+str(player["playInfo"]["spellCount"]) +","+str(player["playInfo"]["healAmount"]) +","+str(player["playInfo"]["sentinelKillCount"]) +","+str(player["playInfo"]["demolisherKillCount"]) +","+str(player["playInfo"]["trooperKillCount"])
        +","+str(player["playInfo"]["guardianKillCount"]) +","+str(player["playInfo"]["guardTowerKillCount"]) +","+str(player["playInfo"]["getCoin"]) +","+str(player["playInfo"]["spendCoin"]) +","+str(player["playInfo"]["spendConsumablesCoin"])
        +","+str(player["playInfo"]["playTime"])+","+str(player["playInfo"]["responseTime"])+","+str(player["playInfo"]["minLifeTime"])+","+str(player["playInfo"]["maxLifeTime"])
        +","+player["position"]["name"]+","+player["position"]["attribute"][0]["id"]+","+player["position"]["attribute"][1]["id"]+","+player["position"]["attribute"][2]["id"])

        itemNum =0
        for j in range(0,16):
            try:
                if (player["items"][itemNum]["equipSlotCode"] == equipment[j]):
                    f.write(","+player["items"][itemNum]["itemId"])
                    itemNum = itemNum+1
                else:
                    f.write(",notEquip")
            except:
                f.write(",notEquip")
                continue
        f.write("\n")
    f.close()
