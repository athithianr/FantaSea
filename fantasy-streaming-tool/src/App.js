import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'

import SignIn from './SignIn'
import MainPage from './MainPage'


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

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <section>
        {user ? <MainPage auth={auth}/> : <SignIn />}
      </section>
    </div>
  );
}


export default App;

