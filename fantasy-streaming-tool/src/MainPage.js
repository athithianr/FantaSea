import 'firebase/auth';
import './App.css';

import LeagueMenu from './LeagueMenu'
import NavBar from './NavBar'

const MainPage = (props) => {
    return (
        <div className="main-page">
            <NavBar auth={props.auth}></NavBar>
            <LeagueMenu></LeagueMenu>
        </div>

    );
}

export default MainPage;