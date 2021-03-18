import requests
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import re

url = "https://hashtagbasketball.com/nba-defense-vs-position"

headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

response = requests.request("GET", url, headers=headers)
rx_to_last = r'^.*{}'.format(re.escape('<h2 class="pull-left">POSITION DATA</h2>'))
rx_to_last2 = r'{}.*'.format(re.escape('<div class="social-bar">'))
result = re.sub(rx_to_last, '',response.text,flags=re.DOTALL).strip()
result2 = re.sub(rx_to_last2,'',result,flags=re.DOTALL).strip()


soup = BeautifulSoup(result2, 'lxml')
table = soup.find("div", {"class": "table-responsive"})
tr = table.findAll("tr")
categories = []
teams = []
positions = []
points = []
fg = []
ft = []
threes = []
rebounds = []
assists = []
steals = []
blocks = []
turnovers = []

i=0
for thread in tr:
  td=thread.find("td")
  team = thread.findAll("span")

  if(team):
    teams.append(team[0].decode_contents())
    points.append(team[2].decode_contents())
    fg.append(team[4].decode_contents())
    ft.append(team[6].decode_contents())
    threes.append(team[8].decode_contents())
    rebounds.append(team[10].decode_contents())
    assists.append(team[12].decode_contents())
    steals.append(team[14].decode_contents())
    blocks.append(team[16].decode_contents())
    turnovers.append(team[18].decode_contents())
  if(td):
    positions.append(td.decode_contents())    

  i+=1


#save data into an output
output=pd.DataFrame({'Position':positions,'Points':points,'Team':teams, 'FG%':fg, 'FT%':ft, '3PM':threes, 'Rebounds':rebounds,'Assists':assists,'Steals':steals,'Blocks':blocks,'Turnovers':turnovers})
new_order = ['Position','Points','Team','FG%','FT%','3PM','Rebounds','Assists','Steals','Blocks','Turnovers']
output = output.reindex(new_order, axis=1)


output.to_csv('/Users/arajkumar/Desktop/fantasy-streaming-application/fantasy-streaming-tool/scraped_data/defense_vs_position.csv')


