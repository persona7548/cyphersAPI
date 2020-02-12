import requests
import time
import pandas
import json
from bs4 import BeautifulSoup

f = open('C:/Users/KTH/Desktop/python/userID.csv',encoding='ANSI')
csvfile = pandas.read_csv('C:/Users/KTH/Desktop/python/userID.csv',header=None,encoding='ANSI')
f.close()

f = open('C:/Users/KTH/Desktop/GitHub/realUserID.csv', 'a')
for i in range(0,9948):
    userID = str(csvfile[i][0])
    url = 'https://api.neople.co.kr/cy/players?nickname='+userID+'&wordType=<wordType>&apikey=<secret>'
    r = requests.get(url)
    data = json.loads(r.text)
    f.write(data["rows"][0]["playerId"]+',')
    time.sleep(0.5)
f.close()
