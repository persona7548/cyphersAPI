import requests
import json

headers = {'Content-Type': 'application/json; charset=utf-8','apikey' :'SECRET'}

for j in range(0,10000,1000):
    url = 'https://api.neople.co.kr/cy/ranking/ratingpoint?&offset='+str(j)+'&limit=1000&apikey='
    r = requests.get(url=url,headers = headers)
    data = json.loads(r.text)
    for i in range(0,1000):
        f = open('C:/Users/KTH/Desktop/GitHub/userID.csv', 'a')
        try:
            nickname = str(data["rows"][i]["nickname"])
            playerId = str(data["rows"][i]["playerId"])
            ratingPoint = str(data["rows"][i]["ratingPoint"])
            print(nickname+','+playerId+','+ratingPoint)
            f.write(nickname+','+playerId+','+ratingPoint+'\n')
        except:
            continue
        f.close()
