import firebase from 'firebase/app'
import React from 'react'


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
                // const credential = result.credential
                // Yahoo OAuth access token and ID token can be retrieved by calling:
                // var accessToken = credential.accessToken;
                // var idToken = credential.idToken;
            })
            .catch((error) => {
                // Handle error.
            });
    }
    return (
        <div class="sign-in-page">
            <div className="sign-in-header">
                <div class="container flex">
                    <h1 class='logo'>Fanta Sea</h1>
                    <nav>
                        <div class="modal-icons">
                            <div class="flex-container">
                                <div class=" icon-flex">
                                    <a href="https://github.com/athithianr/fantasy-streaming-application" target="_blank">
                                        <i class="fa fa-github"></i>
                                    </a>
                                </div>
                                <div class=" icon-flex">
                                    <a href="" target="_blank">
                                        <i class="fa fa-instagram"></i>
                                    </a>
                                </div>
                                <div class="icon-flex">
                                    <a href=""
                                        target="_blank">
                                        <i class="fa fa-file"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <section class="sign-in-body">
                <div class="container">
                    <div class="text-button">
                    <div class="showcase-text">
                        <h2>A comprehensive Yahoo fantasy sports tool for optimizing player pickups.</h2>
                    </div>
                    <div className="signInButton">
                        <button class="yahoo-button" onClick={signInWithYahoo}>Sign in with Yahoo</button>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SignIn;