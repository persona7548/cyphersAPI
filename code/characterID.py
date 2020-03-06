import requests
import json
import time
headers = {'Content-Type': 'application/json; charset=utf-8','apikey' :'<SERECT>'}
url = 'https://api.neople.co.kr/cy/characters'
r = requests.get(url=url,headers = headers)
data = json.loads(r.text)

for i in range(len(data["rows"])):
    f = open('C:/Users/KTH/Desktop/GitHub/characterID.csv', 'a')
    try:
        characterId = str(data["rows"][i]["characterId"])
        characterName = str(data["rows"][i]["characterName"])
        print(characterId+','+characterName)
        f.write(characterId+','+characterName+'\n')
    except:
        continue
    f.close()
