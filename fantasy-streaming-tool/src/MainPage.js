import 'firebase/auth';
import './App.css';

import LeagueMenu from './LeagueMenu'



const SignOut = (props) => {
    const auth = props.auth
    return auth.currentUser && (
        <div className="signOutButton">
            <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}
const MainPage = (props) => {
    return (
        <div className="main-page">
            <LeagueMenu></LeagueMenu>
            <SignOut auth={props.auth} />
        </div>

    );
}

export default MainPage;