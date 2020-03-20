import requests
import time
import pandas
import json

headers = {'Content-Type': 'application/json; charset=utf-8','apikey' :'SECRET'}
csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/userID.csv',header=None,encoding='ANSI')

for j in range(len(csvfile)):
    try:
        userID = str(csvfile[1][j])
    except:
        continue
    next =''
    while next != "None":
        time.sleep(0.1)
        url = 'https://api.neople.co.kr/cy/players/'+userID+'/matches?limit=100&next='+next
        try:
            r = requests.get(url=url,headers = headers)
        except:
            time.sleep(1)
            print(id," 정지됨")
            continue
        data = json.loads(r.text)
        try:
            next = str(data["matches"]["next"])
        except:
            break
        for i in range(0,100):
            try:
                f = open('C:/Users/KTH/Desktop/GitHub/matchId.csv', 'a')
                matchId = str(data["matches"]["rows"][i]["matchId"])
                f.write(matchId+'\n')
                f.close()
            except:
                break
    time.sleep(0.1)
    print(j)
