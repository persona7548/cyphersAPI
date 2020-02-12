import requests
import time
import pandas
import json
from bs4 import BeautifulSoup


url = 'https://api.neople.co.kr/cy/players/'+userID+'/matches?gameTypeId=<gameTypeId>&startDate=<startDate>&endDate=<endDate>&limit=100&next=<next>&apikey=<secret>'
r = requests.get(url)
data = json.loads(r.text)
exchangeID = str(data["rows"][0]["matchId"])
print(exchangeID)
