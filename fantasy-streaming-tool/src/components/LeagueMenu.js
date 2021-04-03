import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import ContentLoader from 'styled-content-loader'
import MatchupInfo from './MatchupInfo'

import "react-datepicker/dist/react-datepicker.css";

const axios = require('axios')
let leagues;
let league_key;
const LeagueMenu = ({ sendPlayerData, sendAdvancedStats}) => {
    const [matchupData, sendMatchupData] = useState('')
    var parser = new DOMParser();
    let league_list = [];
    const [leagueList, setLeagueList,] = useState(league_list)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isLoading, setLoad] = useState(true)
    function createLeagueDropdown() {
        let leagueoptions = "<option value='Select'>Select</option>"
        if (leagueList.length > 0) {
            for (let i = 0; i < leagueList.length; i++) {
                leagueoptions += `<option value=${leagueList[i].name}>2020 - ${leagueList[i].name}</option>`
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
        if(leagueSelected === 'Select')
        {
            console.error("Please select a league!")
            sendMatchupData('')
            sendPlayerData('')
            sendAdvancedStats('')
            return
        }
        if (endDate < startDate)
        {
            console.error("Please enter a valid date range!")
            return
        }
        let positionSelected = document.getElementById("position").value;
        let CURRENT_WEEK;
        if (endDate < startDate)
            console.log("Please enter a valid date range!")

        for (let i = 0; i < leagues.getElementsByTagName("league").length; i++) {
            const league = leagues.getElementsByTagName("league")[i]
            if (league.getElementsByTagName("name")[0].innerHTML === leagueSelected) {            
                league_key = league.getElementsByTagName("league_key")[0].innerHTML
                CURRENT_WEEK = league.getElementsByTagName("current_week")[0].innerHTML
            }
        }
        axios.get(`/api/extractPlayers/${league_key},${positionSelected}/${CURRENT_WEEK}`)
            .then(res => {
                const sendList = []
                const sendPlayerList = []
                const players = res.data.players;
                const matchup_data = res.data.matchup;
                const matchup_differentials = res.data.data;
                const stat_win = res.data.stat_winners;
                const player_stats = res.data.player_stat;
                sendList.push(matchup_data)
                sendList.push(matchup_differentials)
                sendList.push(stat_win)
                sendPlayerList.push(players)
                sendPlayerList.push(player_stats)
                sendPlayerData(sendPlayerList)
                sendMatchupData(sendList)
                let teams = ''
                let primary_positions = ''
                for (let i = 0; i < res.data.players.length; i++) {
                    primary_positions += (res.data.players[i].primary_position)
                    teams += (res.data.players[i].editorial_team_abbr)
                    if(i !== res.data.players.length-1)
                        teams+=','
                        primary_positions+=','
                }
                console.log(teams)
                axios.get(`/api/getAdvancedMatchupStats/${teams}/${startDate}/${endDate}/${matchup_differentials[0][0]}/${primary_positions}`)
                    .then(response => {
                        sendAdvancedStats(response.data)
                    })
            }).catch((err) => console.log(err))

    }

    function getLeagueData() {
        axios.get(`/api/setup/${window.localStorage.getItem('token')}`)
            .then(res => {
                let xmlDoc = parser.parseFromString(res.data, "text/xml");
                const root = xmlDoc.documentElement
                const games = root.getElementsByTagName("game")
                if (games[games.length - 1].getElementsByTagName("season")[0].innerHTML === '2020') {
                    leagues = games[games.length - 1].getElementsByTagName("leagues")[0]
                    const numLeagues = leagues.getElementsByTagName("league").length;
                    for (let i = 0; i < numLeagues; i++) {
                        const league = leagues.getElementsByTagName("league")[i]
                        const LEAGUE  = {
                            name: league.getElementsByTagName("name")[0].innerHTML,
                            current_week:league.getElementsByTagName("current_week")[0].innerHTML,
                        }

                        league_list.push(LEAGUE)
                    }
                }
                setLeagueList(league_list);
                return league_list
            }).catch((err) => console.log(err))
    }

    useEffect(() => {
        getLeagueData()
        createLeagueDropdown()
    }, []);

    return (
        <ContentLoader
            isLoading={isLoading}>
            <section className="dropdown-menu">
                <div className="flex text-center">
                    <div className="item">
                        <h2 className="dropdown-heading text-center my-1">Filters</h2>
                        <div className="grid grid-2 text-center my-4">
                            <div className="drop_down">
                                <label htmlFor="leagues">Choose a League: </label>
                                <br></br>
                                <select name="leagues" id="leagues"></select>
                            </div>
                            <div className="drop_down">
                                <label htmlFor="week">Week </label>
                                <br></br>
                                <select name="week" id="weeks">
                                    <option value="select">Latest week</option>
                                </select>
                            </div>
                            <div className="drop_down">
                                <label htmlFor="date-range">Select a date range: </label>
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
                                <label htmlFor="positions">Position: </label>
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
                <div className="container text-center">
                    <button className="submit-btn text-center" onClick={handleDropdownSelections}>Submit</button>
                </div>
            </section >
        </ContentLoader>
    )
}

export default LeagueMenu;