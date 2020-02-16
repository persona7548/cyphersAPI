import requests
import time
import pandas
import json

headers = {'Content-Type': 'application/json; charset=utf-8','apikey' :'SECRET'}
csvfile = pandas.read_csv('C:/Users/KTH/Desktop/GitHub/userID.csv',header=None,encoding='ANSI')
csvfile = csvfile.drop_duplicates()

for j in range(len(csvfile)):
    try:
        userID = str(csvfile[1][j])
    except:
        continue
    next =''
    while next != "None":
        url = 'https://api.neople.co.kr/cy/players/'+userID+'/matches?limit=100&next='+next
        r = requests.get(url=url,headers = headers)
        data = json.loads(r.text)
        print(data)
        next = str(data["matches"]["next"])
        for i in range(0,100):
            try:
                f = open('C:/Users/KTH/Desktop/GitHub/matchId.csv', 'a')
                matchId = str(data["matches"]["rows"][i]["matchId"])
                f.write(matchId+'\n')
                f.close()
            except:
                break
    time.sleep(2)
    print(j)
