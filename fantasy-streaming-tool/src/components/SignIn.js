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
        <div className="sign-in-page">
            <div className="sign-in-header">
                <div className="container flex">
                    <h1 className='logo'>Fanta Sea</h1>
                    <nav>
                        <div className="modal-icons">
                            <div className="flex-container">
                                <div className=" icon-flex">
                                    <a href="https://github.com/athithianr/fantasy-streaming-application" target="_blank" rel="noreferrer">
                                        <i className="fa fa-github"></i>
                                    </a>
                                </div>
                                <div className=" icon-flex">
                                    <a href="https://github.com/athithianr/fantasy-streaming-application" target="_blank" rel="noreferrer">
                                        <i className="fa fa-instagram"></i>
                                    </a>
                                </div>
                                <div className="icon-flex">
                                    <a href="https://github.com/athithianr/fantasy-streaming-application"
                                        target="_blank" rel="noreferrer">
                                        <i className="fa fa-file"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <section className="sign-in-body">
                <div className="container">
                    <div className="text-button">
                        <div className="showcase-text">
                            <h2>A comprehensive Yahoo fantasy sports tool for optimizing player pickups.</h2>
                        </div>
                        <div className="signInButton">
                            <button className="yahoo-button" onClick={signInWithYahoo}>Sign in with Yahoo</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SignIn;