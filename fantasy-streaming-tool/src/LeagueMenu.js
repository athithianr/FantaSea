import {useState, useEffect} from 'react'
const axios = require('axios')



const LeagueMenu = () => {
    // const url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues'
    var parser = new DOMParser();
    let league_list = [];
    const [leagueList, setLeagueList,] = useState(league_list)

    function createLeagueDropdown() {
        let leagueoptions = "<option value='0'>Select</option>" 
        if(leagueList.length > 0)
        {
            for (let i = 0; i < leagueList.length; i++) {
                leagueoptions += `<option value=${leagueList[i]}>2020 - ${leagueList[i]}</option>`
            }
            document.getElementById("leagues").innerHTML = leagueoptions;
            return;
        }
        else{
            setTimeout(createLeagueDropdown, 500)
        }
    }
    
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
                return league_list
            }).catch((err) => console.log(err))
    }

    useEffect(() => {
        getLeagueData()
        createLeagueDropdown()
    }, []); // <-- empty array means 'run once'

    return (
        <div className="drop_down">
            <label for="leagues">Choose a League: </label>
            <select name="leagues" id="leagues"></select>
        </div>
    )
}

export default LeagueMenu;