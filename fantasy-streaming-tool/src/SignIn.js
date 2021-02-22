import firebase from 'firebase/app'
import React from 'react'
const axios = require('axios')
const config = require('./conf')

const SignIn = () => {
    const signInWithYahoo = () => {
        const provider = new firebase.auth.OAuthProvider('yahoo.com')
        provider.setCustomParameters({
            prompt: 'login',
            language: 'en'
        });
        provider.addScope('fspt-w');
        provider.addScope('profile')
        provider.addScope('email')
        provider.addScope('openid')
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                const credential = result.credential;

                // Yahoo OAuth access token and ID token can be retrieved by calling:
                var accessToken = credential.accessToken;
                var idToken = credential.idToken;



            })
            .catch((error) => {
                // Handle error.
            });
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

export default SignIn;