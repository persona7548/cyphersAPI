import requests
import time
from bs4 import BeautifulSoup

for pageNum in range(1,200):
    time.sleep(0.5)
    url = 'http://cyphers.nexon.com/cyphers/article/ranking/total/15/'+str(pageNum)
    r = requests.get(url)
    html = r.content
    soup = BeautifulSoup(html, 'html.parser')
    titles_html = soup.select('.board_list > tbody > tr > td > a')
    f = open('C:/userID.csv', 'a')
    for i in range(len(titles_html)):
        userID = titles_html[i].text
        f.write(userID+',')
    f.close()
