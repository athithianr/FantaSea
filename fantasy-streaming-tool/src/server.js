const express = require('express')
const app = express()
var cors = require('cors')

app.use(cors())
const config = require('./conf')
const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
const qs = require('qs')
const fetch = require('node-fetch')
const conf = require('./conf')
const fs = require('fs');
const AUTH_FILE = "/Users/arajkumar/Desktop/fantasy-streaming-application/fantasy-streaming-tool/src/auth.json"
const auth = require('./auth.json')
const axios = require('axios')
const AUTH_ENDPOINT = "https://api.login.yahoo.com/oauth2/get_token"

app.get('/', (req, res) => {
    res.status(200).send(`Hello World! Our server is running at port ${port}`);
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

app.get('/authorize', async (request, res) => 
{
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
    const json_blob = await fetch_res.json()
    console.log(json_blob)
}
)

app.get('/makeRequest', async (request, res) => 
{
    // const url = request.params.
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
          res.status(200).send(response.data)
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
    makeAPIrequest('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues');
}
)

const port = 5000;

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});


