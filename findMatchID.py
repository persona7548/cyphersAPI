import requests
import time
import pandas
import json

csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/matchId.csv',header=None,encoding='ANSI')
for j in range(0,10000):
    time.sleep(2)
    try:
        userID = str(csvfile[1][j])
        headers = {'Content-Type': 'application/json; charset=utf-8'}
        url = 'https://api.neople.co.kr/cy/players/'+userID+'/matches?gameTypeId=rating&limit=100&apikey='+API_KEY
        r = requests.get(url=url,headers = headers)
        data = json.loads(r.text)
        for i in range(0,100):
            try:
                f = open('C:/Users/KTH/Desktop/GitHub/matchId.csv', 'a')
                matchId = str(data["matches"]["rows"][i]["matchId"])
                f.write(matchId+'\n')
                f.close()
            except:
                break
    except:
        break
    print(j)
