const express = require('express')
const app = express()
const cors = require('cors')
const qs = require('qs')
const config = require('./conf')
const fetch = require('node-fetch')
const fs = require('fs');
const auth = require('./auth.json')
const axios = require('axios')
const DataFrame = require('dataframe-js').DataFrame
const parseString = require('xml2js').parseString;

app.use(cors())

const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
const AUTH_FILE = "/Users/arajkumar/Desktop/fantasy-streaming-application/fantasy-streaming-tool/src/auth.json"
const BASE_URL = "https://fantasysports.yahooapis.com/fantasy/v2";

app.get('/', async (req, res) => {
  const df=await DataFrame.fromCSV('/Users/arajkumar/Desktop/fantasy-streaming-application/fantasy-streaming-tool/scraped_data/defense_vs_position.csv')
  df.show()
  res.status(200).send("Hello!")
  // console.log(df)
});

//write to external file
function writeToFile(data, file, flag) {
  if (flag === null) {
    flag = `a`;
  }
  fs.writeFile(file, data, { flag }, (err) => {
    if (err) {
      console.error(`Error in writing to ${file}: ${err}`);
    }
  });
  return 1;
}

function refreshAuthorizationToken(token) {
  return axios({
    url: "https://api.login.yahoo.com/oauth2/get_token",
    method: "post",
    headers: {
      Authorization: `Basic ${AUTH_HEADER}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
    },
    data: qs.stringify({
      redirect_uri: "oob",
      grant_type: "refresh_token",
      refresh_token: token,
    }),
  }).catch((err) => {
    console.error(`Error in refreshAuthorizationToken(): ${err}`);
  });
}

//general purpose function to make API requests
async function makeAPIrequest(url) {
  let response;
  try {
    response = await axios({
      url,
      method: "get",
      headers: {
        'Authorization': `Bearer ${auth.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
      },
    });
    return response
  } catch (err) {
    if (err.response.data && err.response.data.error && err.response.data.error.description && err.response.data.error.description.includes("token_expired")) {
      const newToken = await refreshAuthorizationToken(auth.refresh_token);
      if (newToken && newToken.data && newToken.data.access_token) {
        writeToFile(JSON.stringify(newToken.data), AUTH_FILE, "w");
        return makeAPIrequest(url, newToken.data.access_token, newToken.data.refresh_token);
      }
    }
    else {
      console.error(`Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`);
    }
    return err;
  }
}


app.get('/authorize', async (request, res) => {
  const url = "https://api.login.yahoo.com/oauth2/get_token"
  const options =
  {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${AUTH_HEADER}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify
      ({
        client_id: config.CONSUMER_KEY,
        client_secret: config.CONSUMER_SECRET,
        redirect_uri: 'oob',
        code: conf.YAHOO_AUTH_CODE,
        grant_type: 'authorization_code'
      }),
  }
  const fetch_res = await fetch(url, options)
  const json = await fetch_res.json()
}
)


app.get('/setup', async (request, res) => {
  const response = await makeAPIrequest(`${BASE_URL}/users;use_login=1//games;game_key={402}/leagues`);
  res.status(200).send(response.data)
}
)
async function getTeamKey(league_key) {
  const response = await makeAPIrequest(`${BASE_URL}/users;use_login=1/games;game_keys=nba/teams`)
  let team_key;
  parseString(response.data, function (err, result) {
    const games = result.fantasy_content.users[0].user[0].games[0].game;
    for (let i = 0; i < games.length; i++) {
      if (games[i].teams[0].team[0].team_key[0].includes(league_key))
        team_key = games[i].teams[0].team[0].team_key[0];
    }
  });
  return team_key;
}

app.get('/extractPlayers/:league_keyposition', async (request, res) => {

  const league_key_position = request.params.league_keyposition.split(',');
  const league_key = league_key_position[0];
  const position_str = league_key_position[1] ? `;position=${league_key_position[1].toUpperCase()}` : '';

  const team_key = await getTeamKey(league_key);

  const matchup_response = await makeAPIrequest(`${BASE_URL}/team/${team_key}/matchups;weeks=12`)
  parseMatchup(matchup_response.data)

  function Team() {
    this.name = '',
      this.team_key = '',
      this.stats = [];
  }

  async function parseMatchup(data) {

    let team1 = new Team()
    let team2 = new Team()
    let matchup_diff = {}
    let matchup_parsed;
    let stat_winners;
    let stat_win = {
      '5': 0,
      '8': 0,
      '10': 0,
      '12': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0
    }

    parseString(data, function (err, result) {
      matchup_parsed = result;
      teams_data = result.fantasy_content.team[0].matchups[0].matchup[0].teams[0];
      stat_winners = result.fantasy_content.team[0].matchups[0].matchup[0].stat_winners[0].stat_winner
      team1.name = teams_data.team[0].name[0]
      team1.team_key = teams_data.team[0].team_key[0]
      team2.name = teams_data.team[1].name[0]
      team2.team_key = teams_data.team[1].team_key[0]
      team1_stats = teams_data.team[0].team_stats[0].stats;
      team2_stats = teams_data.team[1].team_stats[0].stats;
      for (let i = 0; i < team1_stats[0].stat.length; i++) {
        team1.stats.push(team1_stats[0].stat[i])
        team2.stats.push(team2_stats[0].stat[i])
        if (i < stat_winners.length) {
          if(stat_winners[i].winner_team_key)
          {
          if (stat_winners[i].winner_team_key[0] === team_key) {
            stat_win[stat_winners[i].stat_id[0]] = 1;
          }
        }
        }
      }
    });
    for (let i = 4; i < 11; i++) {
      matchup_diff[team1.stats[i].stat_id] = Math.abs(team1.stats[i].value - team2.stats[i].value);
    }

    let entries = Object.entries(matchup_diff);
    const sorted = entries.sort((a, b) => a[1] - b[1]);

    getPlayerPickups(sorted, matchup_parsed, stat_win)

  }
  async function getPlayerPickups(data, matchup_parsed, stat_win) {
    const stat_id = data[0][0]
    let player_obj = [];
    const topPlayerData = await makeAPIrequest(`${BASE_URL}/league/${league_key}/players;status=A;sort=${stat_id};sort_type=lastmonth;count=5${position_str}`)
    let response_result;
    parseString(topPlayerData.data, function (err, result) {
      response_result = result;

    });
    const players = response_result.fantasy_content.league[0].players[0].player
    let player_keys = [];
    for (let i = 0; i < players.length; i++) {
      player_keys.push(players[i].player_key)
    }
    const player_stats = await getPlayerStats(player_keys);
    player_obj.push(players);
    player_obj.push(matchup_parsed)
    player_obj.push(data)
    player_obj.push(stat_win)
    player_obj.push(player_stats)
    res.status(200).send(player_obj)
  }
  
  async function getPlayerStats(player_keys) {
    let request_url = `${BASE_URL}/players;player_keys=`
    for (let i = 0; i < player_keys.length; i++) {
      request_url += player_keys[i] + ','
    }
    let url = request_url.slice(0, -1)
    url += '/stats;type=lastmonth'
    const resp = await makeAPIrequest(url)
    let stats;
    parseString(resp.data, function (err, result) {
      stats = result.fantasy_content.players[0]
    }
    )
    return stats;
  }
}
)

const port = 5000;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});


