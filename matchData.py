import requests
import time
import pandas
import json

API_KEY = 'SECRET'

csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/matchId.csv',header=None,encoding='ANSI')
headers = {'Content-Type': 'application/json; charset=utf-8'}

matchID = csvfile[0][0]
url = 'https://api.neople.co.kr/cy/matches/'+matchID+'?&apikey='+API_KEY
r = requests.get(url=url,headers = headers)
data = json.loads(r.text)
map = str(data["players"][1]["map"]["name"])
winList = data["teams"][1]["players"]
f = open('C:/Users/KTH/Desktop/GitHub/matchData.csv', 'a')
f.write(matchID+","+map)
for i in range(0,10):
    player = data["players"][i]
    if player["playerId"] in winList:
        f.write(","+str(player["playInfo"]["characterName"]))
f.write("\n")
f.close()

f = open('C:/Users/KTH/Desktop/GitHub/matchInfo.csv', 'a')

for i in range(0,10):
    player = data["players"][i]
    if player["playerId"] in winList:
        f.write(matchID+","+player["playerId"]+","+player["playInfo"]["characterName"]+","+player["position"]["name"]+","+
        player["position"]["attribute"][0]["name"]+","+player["position"]["attribute"][1]["name"]+","+player["position"]["attribute"][2]["name"])
        for j in range(0,16):
            f.write(","+player["items"][j]["itemName"])
        f.write("\n")

f.close()
