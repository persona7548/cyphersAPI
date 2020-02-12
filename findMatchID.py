import requests
import time
import pandas
import json
from bs4 import BeautifulSoup


csvfile = pandas.read_csv('C:/Users/KTH/Desktop/python/realUserID.csv',header=None,encoding='ANSI')
for j in range(0,9947):
    time.sleep(1)
    userID = str(csvfile[1][j])
    if(userID != "nan"):
        headers = {'Content-Type': 'application/json; charset=utf-8'}
        url = 'https://api.neople.co.kr/cy/players/b7750d1ee3b5d9b24e520543b561f388/matches?gameTypeId=rating&startDate=20200101T0000&endDate=20200212T0000&limit=100&apikey=<SECRET>'
        r = requests.get(url=url,headers = headers)
        data = json.loads(r.text)
        for i in range(0,99):
            try:
                f = open('C:/Users/KTH/Desktop/GitHub/matchId.csv', 'a')
                matchId = str(data["matches"]["rows"][i]["matchId"])
                f.write(matchId+'\n')
                f.close()
            except:
                break
    print(j)
