const express = require('express')
const cors = require('cors')
const qs = require('qs')
const config = require('./conf')
const fetch = require('node-fetch')
const fs = require('fs');
const auth = require('./auth.json')
const axios = require('axios')
const dfd = require("danfojs-node")
const parseString = require('xml2js').parseString;
const path = require('path');

const app = express()

//middleware
app.use(express.static(path.join(__dirname, "fantasy-streaming-tool", "build")));
app.use(cors())

const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
const BASE_URL = "https://fantasysports.yahooapis.com/fantasy/v2";

//write to external file
function writeToFile(data, file, flag) {
  if (flag === null) {
    flag = `a`;
  }
  fs.writeFile(file, data, { flag }, (err) => {
    if (err) {
      console.error(`Error in writing to ${file}: ${err}`);
    }else{
      console.log("Success! Wrote to: "+ file)
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
        const jsonPath = path.join(__dirname, 'auth.json');
        console.log(jsonPath)
        writeToFile(JSON.stringify(newToken.data), jsonPath, "w");
        return makeAPIrequest(url, newToken.data.access_token, newToken.data.refresh_token);
      }
    }
    else {
      console.error(`Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`);
    }
    return err;
  }
}


app.get('/api/authorize', async (request, res) => {
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

app.get('/api/getAdvancedMatchupStats/:playerList/:startDate/:endDate/:closest_stat/:primary_positions', async (request, res) => {

  function convertDate(date_list) {
    let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    month1 = date_list[1].toLowerCase();
    month1 = months.indexOf(month1) + 1;
    return `${date_list[3]}-${month1}-${date_list[2]}`
  }

  const team_id_mappings = {
    'ATL': 1,
    'BOS': 2,
    'BKN': 3,
    'CHA': 4,
    'CHI': 5,
    'CLE': 6,
    'DAL': 7,
    'DEN': 8,
    'DET': 9,
    'GSW': 10,
    'HOU': 11,
    'IND': 12,
    'LAC': 13,
    'LAL': 14,
    'MEM': 15,
    'MIA': 16,
    'MIL': 17,
    'MIN': 18,
    'NOP': 19,
    'NY': 20,
    'OKC': 21,
    'ORL': 22,
    'PHI': 23,
    'PHX': 24,
    'POR': 25,
    'SAC': 26,
    'SAS': 27,
    'TOR': 28,
    'UTA': 29,
    'WAS': 30
  }

  let team_abbrevs = request.params.playerList.split(',')
  team_abbrevs.pop()
  let primary_positions = request.params.primary_positions.split(',')
  primary_positions.pop()
  const startDate_list = request.params.startDate.split(' ')
  const endDate_list = request.params.endDate.split(' ')
  const startDate = await convertDate(startDate_list)
  const endDate = await convertDate(endDate_list)
  const closest_stat = request.params.closest_stat;
  async function requestToBallDontLieAPI(url) {
    let response;
    try {
      response = await axios({
        url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response
    } catch (err) {
      console.error(`Error: ${err}`);
      return err;
    }
  }
  let team_ids = [];
  for (let i = 0; i < team_abbrevs.length; i++) {
    team_ids.push(team_id_mappings[team_abbrevs[i].toUpperCase()])
  }

  let team_ids_query = ''
  for (let i = 0; i < team_ids.length; i++) {
    team_ids_query += `&team_ids[]=${team_ids[i]}`
  }

  const upcoming_games = await requestToBallDontLieAPI(`https://www.balldontlie.io/api/v1/games?seasons[]=2020${team_ids_query}&per_page=81&start_date=${startDate}&end_date=${endDate}`)
  const matchup_ids_total = []
  let matchup_ids = []

  for (let i = 0; i < team_ids.length; i++) {
    for (let j = 0; j < upcoming_games.data.data.length; j++) {
      let game = upcoming_games.data.data[j];
      if (game.home_team.id != team_ids[i] && game.visitor_team.id != team_ids[i]) {
        continue;
      }
      else {
        let opponent_id = game.home_team.id != team_ids[i] ? game.home_team.id : game.visitor_team.id
        matchup_ids.push(opponent_id)
      }
    }
    matchup_ids_total.push(matchup_ids)
    matchup_ids = []
  }

  async function getStatByPosition(matchup_id, closest_stat, primary_position) {

    const stat_mappings = {
      '10': 'Threes',
      '12': 'Points',
      '15': 'Rebounds',
      '16': 'Assists',
      '17': 'Steals',
      '18': 'Blocks',
      '19': 'Turnovers'
    }

    const custom_abbrev_mappings = {
      'OKL':21,
      'NYK':20,
      'BRO':3,

    }

    const stat_category = stat_mappings[closest_stat]

    const value1 = dfd.read_csv("fantasy-streaming-tool/scraped_data/defense_vs_position.csv")
      .then(df => {
        df.sort_values({ by: stat_category, inplace: true })
        let grp = df.groupby(["Position"])
        let grp2 = grp.get_groups([primary_position])
        let grp3 = grp2.groupby(["Team"])
        const team_abbrev = Object.keys(team_id_mappings).find(key => team_id_mappings[key] === matchup_id);
        let grp4;
        grp4 = grp3.get_groups([team_abbrev])
        if(grp4 === undefined)
        {
          const team_abbrev = Object.keys(custom_abbrev_mappings).find(key => custom_abbrev_mappings[key] === matchup_id);
          grp4 = grp3.get_groups([team_abbrev])
        }


        const value2 = grp4.to_json()
          .then((json) => {
            const json_obj = JSON.parse(json)
            const stat_against_defense = {
              opponent_team: team_abbrev,
              stat_category: stat_category,
              primary_position: primary_position,
              stat_total: json_obj[0][stat_category]
            }
            return stat_against_defense
          }
          )
        return value2;
      }
      )
    return value1;
  }

  let stat_objects_total = []
  let stat_objects = []
  for (let i = 0; i < matchup_ids_total.length; i++) {
    for await (let matchup_id of matchup_ids_total[i]) {
      const stat_obj = await getStatByPosition(matchup_id, closest_stat,primary_positions[i])
      stat_objects.push(stat_obj)
    }
    stat_objects_total.push(stat_objects)
    stat_objects = []
  }
  console.log(stat_objects_total)
  res.status(200).send(stat_objects_total)
})


app.get('/api/setup', async (request, res) => {
  console.log("Hello")
  let response;
  // Add retries for request to evade network errors
  for (let i = 1; i <= 10; i++) {
    response = await makeAPIrequest(`${BASE_URL}/users;use_login=1//games;game_key={402}/leagues`);

    console.log(response.status)
    if (response.status === 200)
      break;
    else
      setTimeout(1000)
  }
  res.status(200).send(response.data)
}
)
async function getTeamKey(league_key) {
  const response = await makeAPIrequest(`${BASE_URL}/users;use_login=1/games;game_keys=nba/teams`)
  let team_key;

  parseString(response.data, function (err, result) {
    if (err) {
      console.log(err)
    }
    else {
      const games = result.fantasy_content.users[0].user[0].games[0].game;
      for (let i = 0; i < games.length; i++) {
        let keys = games[i].teams[0].team[0].team_key[0]
        if (keys.includes(league_key))
          team_key = keys;
      }
    }
  });
  return team_key;
}

app.get('/api/extractPlayers/:league_keyposition', async (request, res) => {

  const league_key_position = request.params.league_keyposition.split(',');
  const league_key = league_key_position[0];
  const position = league_key_position[1] ? `;position=${league_key_position[1].toUpperCase()}` : '';

  const team_key = await getTeamKey(league_key);

  const matchup_response = await makeAPIrequest(`${BASE_URL}/team/${team_key}/matchups;weeks=13`)
  parseMatchup(matchup_response.data)

  function Team() {
    this.name = '',
      this.team_key = '',
      this.stats = [];
  }

  async function parseMatchup(matchup_data) {

    let team1 = new Team()
    let team2 = new Team()
    let matchup_diff = {}
    let matchup_parsed;
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

    parseString(matchup_data, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        matchup_parsed = result;
        teams_data = result.fantasy_content.team[0].matchups[0].matchup[0].teams[0];
        const stat_winners = result.fantasy_content.team[0].matchups[0].matchup[0].stat_winners[0].stat_winner
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
            if (stat_winners[i].winner_team_key) {
              if (stat_winners[i].winner_team_key[0] === team_key) {
                stat_win[stat_winners[i].stat_id[0]] = 1;
              }
            }
          }
        }
      }

    });

    //only extract pts/rebs/assists/stls/blks/tovs
    for (let i = 4; i < 11; i++) {
      matchup_diff[team1.stats[i].stat_id] = Math.abs(team1.stats[i].value - team2.stats[i].value);
    }

    const entries = Object.entries(matchup_diff);
    const sorted_matchup_differentials = entries.sort((a, b) => a[1] - b[1]);

    getPlayerPickups(sorted_matchup_differentials, matchup_parsed, stat_win)

  }

  async function getPlayerPickups(data, matchup_parsed, stat_win) {
    //get the closest stat in the matchup's id
    const stat_id = data[0][0]
    const topPlayerFromWaiverResponse = await makeAPIrequest(`${BASE_URL}/league/${league_key}/players;status=A;sort=${stat_id};sort_type=lastmonth;count=5${position}`)
    let response_result;
    parseString(topPlayerFromWaiverResponse.data, function (err, result) {
      response_result = result;
    });
    const players = response_result.fantasy_content.league[0].players[0].player
    let player_keys = [];
    for (let i = 0; i < players.length; i++) {
      player_keys.push(players[i].player_key)
    }
    const player_stats = await getPlayerStats(player_keys);
    const obj = {
      players: players,
      matchup: matchup_parsed,
      data: data,
      stat_winners: stat_win,
      player_stat: player_stats
    }
    res.status(200).send(obj)
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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "fantasy-streaming-tool", "build", "index.html"));
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});


