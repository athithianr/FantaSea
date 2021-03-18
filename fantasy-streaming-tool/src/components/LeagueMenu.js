import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import ContentLoader from 'styled-content-loader'
import MatchupInfo from './MatchupInfo'

import "react-datepicker/dist/react-datepicker.css";

const axios = require('axios')
let leagues;
let league_key;

const LeagueMenu = ({ sendPlayerData }) => {
    const [matchupData, sendMatchupData] = useState('')
    var parser = new DOMParser();
    let league_list = [];
    const [leagueList, setLeagueList,] = useState(league_list)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isLoading, setLoad] = useState(true)

    function createLeagueDropdown() {
        let leagueoptions = "<option value='0'>Select</option>"
        if (leagueList.length > 0) {
            for (let i = 0; i < leagueList.length; i++) {
                leagueoptions += `<option value=${leagueList[i]}>2020 - ${leagueList[i]}</option>`
            }
            setLoad(false)
            document.getElementById("leagues").innerHTML = leagueoptions;
            return;
        }
        else {
            setTimeout(createLeagueDropdown, 500)
        }
    }
    function handleDropdownSelections() {
        let leagueSelected = document.getElementById("leagues").value;
        let positionSelected = document.getElementById("position").value;
        for (let i = 0; i < leagues.getElementsByTagName("league").length; i++) {
            const league = leagues.getElementsByTagName("league")[i]
            if (league.getElementsByTagName("name")[0].innerHTML == leagueSelected) {
                league_key = league.getElementsByTagName("league_key")[0].innerHTML
            }
        }
        axios.get(`http://localhost:5000/extractPlayers/${league_key},${positionSelected}`)
            .then(res => {
                const sendList = []
                const sendPlayerList = []
                sendList.push(res.data[1])
                sendList.push(res.data[2])
                sendList.push(res.data[3])
                sendPlayerList.push(res.data[0])
                sendPlayerList.push(res.data[4])
                sendPlayerData(sendPlayerList)
                sendMatchupData(sendList)
            }).catch((err) => console.log(err))
    }

    function getLeagueData() {
        axios.get(`http://localhost:5000/setup`)
            .then(res => {
                let xmlDoc = parser.parseFromString(res.data, "text/xml");
                const root = xmlDoc.documentElement
                const games = root.getElementsByTagName("game")
                if (games[games.length - 1].getElementsByTagName("season")[0].innerHTML == 2020) {
                    leagues = games[games.length - 1].getElementsByTagName("leagues")[0]
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
        <ContentLoader
            isLoading={isLoading}>
            <section className="dropdown-menu">
                <div className="container text-center">
                    <div className="flex text-center">
                        <div className="item">
                            <h2 className="dropdown-heading text-center my-1">Filters</h2>
                            <div className="grid grid-2 text-center my-4">
                                <div className="drop_down">
                                    <label for="leagues">Choose a League: </label>
                                    <br></br>
                                    <select name="leagues" id="leagues"></select>
                                </div>
                                <div className="drop_down">
                                    <label for="agro">Aggressiveness </label>
                                    <br></br>
                                    <select name="agro" id="leagues"></select>
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
                                    <select name="select-position" id="position">
                                        <option value="select">All Players</option>
                                        <option value="pg">PG</option>
                                        <option value="sg">SG</option>
                                        <option value="sf">SF</option>
                                        <option value="pf">PF</option>
                                        <option value="c">C</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <MatchupInfo matchupData={matchupData}></MatchupInfo>
                        </div>
                    </div>
                    <button className="submit-btn" onClick={handleDropdownSelections}>Submit</button>
                </div>
            </section >
        </ContentLoader>
    )
}

export default LeagueMenu;