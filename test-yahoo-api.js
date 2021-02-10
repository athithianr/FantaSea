const config = require('./conf.js');
const axios = require("axios");
const qs = require("qs");
const fs = require('fs');



const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
const myConsole = new console.Console(fs.createWriteStream("/Users/arajkumar/Desktop/fantasy-streaming-application/response.txt"));


  // const AUTH_HEADER = "ZGoweUptazlSRUp6YjBwWFFYcFdOazU0Sm1ROVdWZHJPV1ZxUW05a00yUlBaRzB3YldOSGJ6bE5RVDA5Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQV1kxOiAwZjUwNGFiNzk5NzZmYjE2OTVmMmU4NmQ1N2EyMmI3ZWQyMTE2N2M1"

// function getAuthorizationURL () {
//   return axios({
//     url: `https://api.login.yahoo.com/oauth2/request_auth`,
//     method: 'get',
//     headers: {
//         // 'Authorization': `Basic ${AUTH_HEADER}`,
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
//     },
//     data:({
//         client_id: config.CONSUMER_KEY,
//         redirect_uri: 'oob',
//         response_type: 'code'
//     }),
//     }).catch((err) => {
//         console.error(`Error in getAuthorizationURL(): ${err}`);
//     }).then(resp => console.log(resp))
    
// }


function getInitialAuthorization () {
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
      }).then(resp => myConsole.log(resp))
}


// Hit the Yahoo Fantasy API
async function makeAPIrequest (url) {
  let response;
  try {
      response = await axios({
      url: url,
          method: 'get',
          headers: {
              'Authorization': `Bearer ${config.ACESS_TOKEN}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
          },
          timeout: 10000,
      });
      const jsonData = JSON.parse(parser.toJson(response.data));
      return jsonData;
  } catch (err) {
      if (err.response.data && err.response.data.error && err.response.data.error.description && err.response.data.error.description.includes("token_expired")) {
          const newToken = await refreshAuthorizationToken(CREDENTIALS.refresh_token);
          if (newToken && newToken.data && newToken.data.access_token) {
              CREDENTIALS = newToken.data;
              // Just a wrapper for fs.writeFile
              writeToFile(JSON.stringify(newToken.data), AUTH_FILE, 'w');
              return makeAPIrequest(url, newToken.data.access_token, newToken.data.refresh_token);

           }
      } else {
          console.error(`Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`);
          process.exit();
      }
  }
}

const resp = getInitialAuthorization();

