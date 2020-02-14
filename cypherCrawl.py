import requests
import json

for j in range(0,10000,1000):
    url = 'https://api.neople.co.kr/cy/ranking/ratingpoint?&offset='+j+'&limit=1000&apikey=<SECRET>'
    r = requests.get(url)
    data = json.loads(r.text)
    for i in range(0,1000):
        f = open('C:/Users/KTH/Desktop/GitHub/matchId.csv', 'a')
        try:
            nickname = str(data["rows"][i]["nickname"])
            playerId = str(data["rows"][i]["playerId"])
            print(nickname+','+playerId)
            f.write(nickname+','+playerId+'\n')
        except:
            continue
        f.close()
