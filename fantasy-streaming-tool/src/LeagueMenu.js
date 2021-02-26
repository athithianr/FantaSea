import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";


const axios = require('axios')



const LeagueMenu = () => {
    // const url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1//games;game_key={402}/leagues'
    var parser = new DOMParser();
    let league_list = [];

    const [leagueList, setLeagueList,] = useState(league_list)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());


    function createLeagueDropdown() {
        let leagueoptions = "<option value='0'>Select</option>"
        if (leagueList.length > 0) {
            for (let i = 0; i < leagueList.length; i++) {
                leagueoptions += `<option value=${leagueList[i]}>2020 - ${leagueList[i]}</option>`
            }
            document.getElementById("leagues").innerHTML = leagueoptions;
            return;
        }
        else {
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
        <section className="dropdown-menu">
            <div className="container">
                <h2 className="dropdown-heading text-center my-1">Filters</h2>
                <div className="grid grid-2 text-center my-4">
                    <div className="drop_down">
                        <label for="leagues">Choose a League: </label>
                        <select name="leagues" id="leagues"></select>
                    </div>
                    <div className="drop_down">
                        <label for="leagues">Aggressiveness </label>
                        <select name="leagues" id="leagues"></select>
                    </div>
                    <div className="drop_down">
                        <label for="date-range">Select a date range: </label>
                        <br></br>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </div>
                    <div className="drop_down">
                        <label for="positions">Position: </label>
                        <br></br>
                        <select name="select-position" id="">
                            <option value="select">Select</option>
                            <option value="pg">PG</option>
                            <option value="sg">SG</option>
                            <option value="sf">SF</option>
                            <option value="pf">PF</option>
                            <option value="c">C</option>
                            <option value="forward">F</option>
                            <option value="guard">G</option>
                        </select>
                    </div>
                </div>
                <div className="submit">
                    <button className="submit-btn">Submit</button>
                </div>
            </div>
        </section >

    )
}

export default LeagueMenu;