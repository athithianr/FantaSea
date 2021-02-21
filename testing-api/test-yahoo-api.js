//imported libraries
const config = require('./conf.js');
const axios = require("axios");
const qs = require("qs");
const fs = require('fs');

// secret variables
const conf = require('./conf.js');
const auth = require('./auth.json')

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
    console.log(response.data)
    return response
  } catch (err) 
  {
    if (err.response.data && err.response.data.error && err.response.data.error.description && err.response.data.error.description.includes("token_expired")) 
    {
      const newToken = await refreshAuthorizationToken(auth.refresh_token);
      if (newToken && newToken.data && newToken.data.access_token) 
      {
        writeToFile(JSON.stringify(newToken.data), AUTH_FILE, "w");
        return makeAPIrequest(url, newToken.data.access_token, newToken.data.refresh_token);
      }
    }
    else 
    {
      console.error(`Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`);
    }
    return err;
  }
}

// const resp = getInitialAuthorization();
makeAPIrequest('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues').then(res=>console.log(res.data))

//'https://fantasysports.yahooapis.com/fantasy/v2/team/402.l.21869.t.7/roster/players'