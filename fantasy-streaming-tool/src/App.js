import './App.css';
import SplashPage from './SplashPage'

import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore' 

const axios = require("axios");
const qs = require("qs");
const config = require('./conf.js');
const AUTH_ENDPOINT= "https://api.login.yahoo.com/oauth2/get_token"
const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`).toString(`base64`);
const REQUEST_AUTH = "https://api.login.yahoo.com/oauth2/request_auth"


if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCneM-FgVHOLFwWraeGHof-3uLL4tcSsro",
    authDomain: "fantasy-streaming-tool.firebaseapp.com",
    projectId: "fantasy-streaming-tool",
    storageBucket: "fantasy-streaming-tool.appspot.com",
    messagingSenderId: "9785486238",
    appId: "1:9785486238:web:d5feb5734d9b9c7667848f",
    measurementId: "G-QT2W6B02JM"
  });
}
else {
  firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth)


  return (
    <div className="App">
      <header className="App-header">

      </header>
      <section>
        {user ? <MainPage /> : <SignIn />}
      </section>
    </div>
  );
}

function MainPage() {
  return (
    <>
      {<SignOut />}
    </>
  )
}


function SignIn() {
  const signInWithYahoo = () => {
    const provider = new firebase.auth.OAuthProvider('yahoo.com')
    provider.setCustomParameters({
      prompt: 'login',
      language: 'en'
    });
    provider.addScope('fspt-w');
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential;

        // Yahoo OAuth access token and ID token can be retrieved by calling:
        var accessToken = credential.accessToken;
        var idToken = credential.idToken;
        authorizeAcess();
    })
    .catch((error) => {
        // Handle error.
    });


  }
  function authorizeAcess() {
    return axios({
      url: REQUEST_AUTH,
      method: "get",
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
      },
      data: qs.stringify({
        client_id: config.CONSUMER_KEY,
        redirect_uri: "https://fantasy-streaming-tool.firebaseapp.com/auth",
        response_type: "code",
        language: "en-us"
      }),
    }).catch((err) => {
      console.error(`Error in authorizeAcess(): ${err}`);
    }).then((res) =>
    {
      setTimeout(100000)
      console.log(res)
    })
  }
  
  return (

    <div className="signIn" >
      <div class="title">
        <h1>Fanta<br />Sea</h1>
      </div>
      <div className="signInButton">
        <button onClick={signInWithYahoo}>Sign in with Yahoo</button>
      </div>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}



export default App;
