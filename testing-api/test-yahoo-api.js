//imported libraries
const config = require('./conf.js');
const axios = require("axios");
const qs = require("qs");
const fs = require('fs');

// secret variables
const conf = require('./conf.js');
const auth = require('./auth.json');
const parseString = require('xml2js').parseString;


const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);

const AUTH_FILE = "/Users/arajkumar/Desktop/fantasy-streaming-application/testing-api/auth.json"
const AUTH_ENDPOINT = "https://api.login.yahoo.com/oauth2/get_token"

// Write to an external file to display output data
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

function getInitialAuthorization() {
  return axios({
    url: `https://api.login.yahoo.com/oauth2/get_token`,
    method: 'post',
    headers: {
      'Authorization': `Basic ${AUTH_HEADER}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    },
    data: qs.stringify({
      client_id: config.CONSUMER_KEY,
      client_secret: config.CONSUMER_SECRET,
      redirect_uri: 'oob',
      code: config.YAHOO_AUTH_CODE,
      grant_type: 'authorization_code'
    }),
  }).catch((err) => {
    console.error(`Error in getInitialAuthorization(): ${err}`);
  }).then(res => console.log(res))
}

function refreshAuthorizationToken(token) {
  return axios({
    url: AUTH_ENDPOINT,
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

function Team() {
  this.name = '',
    this.team_key = '',
    this.stats = [];
}


async function parseMatchup(data) {

  // let team1 = {
  //   fg_total: '9004003',
  //   fg : '5',
  //   ft_total : '9007006',
  //   ft : '8',
  //   threes: '10',
  //   pts : '12',
  //   rebs : '15',
  //   assists : '16',
  //   steals: '17',
  //   blocks: '18',
  //   tovs:'19'
  // }




  let team1 = new Team()
  let team2 = new Team()
  let matchup_diff = {}


  parseString(data, function (err, result) {
    teams_data = result.fantasy_content.team[0].matchups[0].matchup[0].teams[0];
    team1.name = teams_data.team[0].name[0]
    team1.team_key = teams_data.team[0].team_key[0]
    team2.name = teams_data.team[1].name[0]
    team2.team_key = teams_data.team[1].team_key[0]
    team1_stats = teams_data.team[0].team_stats[0].stats;
    team2_stats = teams_data.team[1].team_stats[0].stats;
    for (let i = 0; i < team1_stats[0].stat.length; i++) {
      team1.stats.push(team1_stats[0].stat[i])
      team2.stats.push(team2_stats[0].stat[i])
    }
  });

  for (let i = 4; i < 11; i++) {
    if (team1.stats[i].stat_id[0] !== 9004003 || 5 || 9007006 || 8) {
      matchup_diff[team1.stats[i].stat_id] = Math.abs(team1.stats[i].value - team2.stats[i].value);
    }
  }

  let entries = Object.entries(matchup_diff);
  let sorted = entries.sort((a, b) => a[1] - b[1]);

  console.log(sorted)
  getPlayerPickups(sorted)

}

async function getPlayerPickups(data) {
  const stat_id = data[0][0]
  const players = [];
  const topPlayerData = await makeAPIrequest(`https://fantasysports.yahooapis.com/fantasy/v2/league/402.l.21869/players;status=A;sort=${stat_id};sort_type=lastmonth;count=5`)
  parseString(topPlayerData.data, function (err, result) {
    console.log(result.fantasy_content.league[0].players)
    const players_list = result.fantasy_content.league[0].players[0].player;
    for (let i = 0; i < players_list.length; i++) {
      console.log(players_list[i])
    }
  });
}





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
    // parseMatchup(response.data)
    console.log(response.data)
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

// const resp = getInitialAuthorization();
// makeAPIrequest('https://fantasysports.yahooapis.com/fantasy/v2/team/402.l.21869.t.7/matchups;weeks=11')
// makeAPIrequest('https://fantasysports.yahooapis.com/fantasy/v2/league/402.l.21869/players;status=A;sort=16;sort_type=lastmonth;count=5')
makeAPIrequest('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams')
//'https://fantasysports.yahooapis.com/fantasy/v2/team/402.l.21869.t.7/roster/players'
//https://fantasysports.yahooapis.com/fantasy/v2/league/402.l.21869.t.7/scoreboard
//https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues
