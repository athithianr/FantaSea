import 'firebase/auth';
import './App.css';
import { useState } from 'react'
const axios = require('axios')



const SignOut = (props) => {
    const auth = props.auth
    return auth.currentUser && (
        <div className="signOutButton">
            <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

const LeagueMenu = () => {
    const url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues'
    var parser = new DOMParser();
    let league_list = [];
    const [leagueList, setLeagueList,] = useState(league_list)

    function getLeagueData() {
        axios.get(`http://localhost:5000/makeRequest`)
            .then(res => {
                let xmlDoc = parser.parseFromString(res.data, "text/xml");
                const root = xmlDoc.documentElement
                const games = root.getElementsByTagName("game")
                if (games[8].getElementsByTagName("season")[0].innerHTML == 2020) {
                    const leagues = games[8].getElementsByTagName("leagues")[0]
                    const numLeagues = leagues.getElementsByTagName("league").length;
                    for (let i = 0; i < numLeagues; i++) {
                        const league = leagues.getElementsByTagName("league")[i]
                        league_list.push(league.getElementsByTagName("name")[0].innerHTML)
                    }
                }
                setLeagueList(league_list);
            }
            )

    }
    return (
        <div className="drop_down">
            {getLeagueData()}
            {console.log(leagueList)}
            <label for="leagues">Choose a League:</label>
            <select name="leagues" id="leagues">
                <option value="league1">{leagueList[0]}</option>
            </select>
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