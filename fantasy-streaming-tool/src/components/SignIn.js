import firebase from 'firebase/app'
import React from 'react'
import bgimage from '../images/joseph-barrientos-oQl0eVYd_n8-unsplash (1).jpg'

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
            const credential = result.credential
            window.localStorage.setItem('token',credential.accessToken);
        })
        .catch((error) => {
            // Handle error.
        });

    }
    return (
        
        <div className="sign-in-page">
            <div className="bg">
            <img src={bgimage}  alt=""></img>
            </div>
            <div  className="sign-in-header">
                <div className="container flex">
                    <h1  className='logo'>Fanta Sea</h1>
                    <nav>
                        <div className="modal-icons">
                            <div className="flex-container">
                                <div className=" icon-flex">
                                    <a href="https://github.com/athithianr/fantasy-streaming-application" target="_blank" rel="noreferrer">
                                        <i className="fa fa-github"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="text-button text-center">
                        <div style={{color:'white'}} className="showcase-text text-center">
                            <h2>A comprehensive Yahoo fantasy sports tool for optimizing player pickups.</h2>
                        </div>
                        <div className="signInButton text-center">
                            <button className="yahoo-button" onClick={signInWithYahoo}>Sign in with Yahoo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;