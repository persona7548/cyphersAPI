import requests
import time
import pandas
import json

API_KEY = <SECRET>
equipment = list(["101","102","103","104","105","106","202","203","301","302","303","304","305","107","204","205"])

csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/matchId.csv',header=None,encoding='ANSI')
csvfile = csvfile.drop_duplicates()

for id in range(len(csvfile)):
    print(id)
    try:
        matchID = csvfile[0][id]
    except:
        continue
    time.sleep(0.1)
    url = 'https://api.neople.co.kr/cy/matches/'+matchID+'?&apikey='
    try:
        r = requests.get(url=url,headers = headers)
    except:
        time.sleep(1)
        print(id," 정지됨")
        continue

    data = json.loads(r.text)
    map = str(data["players"][1]["map"]["name"])

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
            f.write(","+str(player["playInfo"]["characterName"]))
    f.write("\n")
    #create lose match record
    f.write("lose,"+matchID+","+map)
    playerCount = data["players"]
    for i in range(len(playerCount)):
        player = playerCount[i]
        if player["playerId"] in loseList:
            f.write(","+str(player["playInfo"]["characterName"]))
    f.write("\n")
    f.close()

#create detail match infomation
    f = open('C:/Users/KTH/Desktop/GitHub/matchInfo.csv', 'a')
    for i in range(len(playerCount)):
        player = data["players"][i]
        if player["playerId"] in winList:
            f.write("win,"+map+",")
        else:
            f.write("lose,"+map+",")
        f.write(matchID+","+player["playerId"]+","+str(player["playInfo"]["partyUserCount"])+","+player["playInfo"]["characterName"]+","+str(player["playInfo"]["level"])
        +","+str(player["playInfo"]["killCount"])+","+str(player["playInfo"]["deathCount"])+","+str(player["playInfo"]["assistCount"])
        +","+str(player["playInfo"]["attackPoint"])+","+str(player["playInfo"]["damagePoint"])+","+str(player["playInfo"]["battlePoint"])
        +","+str(player["playInfo"]["sightPoint"])+","+str(player["playInfo"]["playTime"])
        +","+player["position"]["name"]+","+player["position"]["attribute"][0]["name"]+","+player["position"]["attribute"][1]["name"]+","+player["position"]["attribute"][2]["name"])

        itemNum =0
        for j in range(0,16):
            try:
                if (player["items"][itemNum]["equipSlotCode"] == equipment[j]):
                    f.write(","+player["items"][itemNum]["itemName"])
                    itemNum = itemNum+1
                else:
                    f.write(",미장착")
            except:
                f.write(",미장착")
                break
        f.write("\n")
    f.close()
    time.sleep(0.1)
