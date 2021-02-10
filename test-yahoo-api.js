const config = require('./conf.js');
const axios = require("axios");
const qs = require("qs");


const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
console.log(AUTH_HEADER);

  // const AUTH_HEADER = "ZGoweUptazlSRUp6YjBwWFFYcFdOazU0Sm1ROVdWZHJPV1ZxUW05a00yUlBaRzB3YldOSGJ6bE5RVDA5Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQV1kxOiAwZjUwNGFiNzk5NzZmYjE2OTVmMmU4NmQ1N2EyMmI3ZWQyMTE2N2M1"

function getInitialAuthorization () {
  return axios({
      url: `https://api.login.yahoo.com/oauth2/get_token`,
      method: 'post',
      headers: {
          'Authorization': `Basic ${AUTH_HEADER}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
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
      });
}

const resp = getInitialAuthorization();
console.log(resp)