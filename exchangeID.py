import requests
import time
import pandas
from bs4 import BeautifulSoup

for i in range(0,9954):
  csvfile = pandas.read_csv('C:/userID.csv',header=None,encoding='ANSI')
  userID = csvfile[i][0]
  print(userID)
  f.close()

