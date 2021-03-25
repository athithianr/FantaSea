import playerIcon from '../images/empty_profile_icon.png'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';


const TopPickupGrid = ({ playerData, advancedStats }) => {

    const stat_mappings = {
        '0': 'Total Games Played',
        '10': 'Threes',
        '12': 'Points',
        '15': 'Rebounds',
        '16': 'Assists',
        '17': 'Steals',
        '18': 'Blocks',
        '19': 'Turnovers'
    }

    function populatePlayerGrid() {
        const players = playerData[0];
        let position = "";
        let img = playerIcon;
        let name = "";
        for (let i = 0; i < players.length; i++) {
            img = 'https' + players[i].image_url[0].replace(/https.*\/https/, '');
            console.log(players)
            console.log(img)
            name = players[i].name[0].full[0];
            position = players[i].display_position[0];
            document.getElementById(`img${i + 1}`).src = img;
            document.getElementById(`name${i + 1}`).innerHTML = name;
            document.getElementById(`pos${i + 1}`).innerHTML = position;
        }
        return;
    }
    function populatePlayerStats() {
        const keys = Object.keys(stat_mappings)
        let stats = {}
        for (let i = 0; i < 5; i++) {
            let games_played = playerData[1].player[i].player_stats[0].stats[0].stat[0].value[0]
            let player_stats = `<br></br><h3>Average Stats(Last month): </h2><p style=font-size:15px;padding:10px>Total Games Played: ${games_played}</p>`
            for (let j = 1; j < keys.length; j++) {
                stats[playerData[1].player[i].player_stats[0].stats[0].stat[keys[j]].stat_id[0]] = (playerData[1].player[i].player_stats[0].stats[0].stat[keys[j]].value[0] / games_played).toFixed(1);
                player_stats += `<p style=font-size:15px>${stat_mappings[playerData[1].player[i].player_stats[0].stats[0].stat[keys[j]].stat_id[0]]}: ${(playerData[1].player[i].player_stats[0].stats[0].stat[keys[j]].value[0] / games_played).toFixed(1)}</p>`
            }
            document.getElementById(`stats${i + 1}`).innerHTML = player_stats;

        }
    }
    function populateMatchupStats() {
        let matchup_data = ''
        for (let i = 0; i < advancedStats.length; i++) {
            for (let j = 0; j < advancedStats[i].length; j++) {
                matchup_data += JSON.stringify(advancedStats[i][j], null, 4) + '<br></br>'
                document.getElementById(`matchup_stats${i + 1}`).innerHTML = matchup_data
            }
            matchup_data = ''
        }

    }

    if (playerData) {
        populatePlayerGrid()
        populatePlayerStats()
    }
    if (advancedStats) {
        populateMatchupStats()
    }

    return (
        <section className="playerGrid">
            {/* <div className="container"> */}
            <h2 className="top-player-grid text-center my-1">Top Player Pickups</h2>
            <div className="player-grid text-center">
                <div className="player-card">
                    <div class="card-header">
                        <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#1.</h5>
                        <h4 id="name1" style={{ 'text-align': 'center', 'float': 'center' }}></h4>
                        <h5 id="pos1"></h5>
                    </div>
                    <div className="card-body">
                        <img id="img1" src={playerIcon} alt=""></img>
                        <div id="stats1" className="text-center uniform-lines"></div>
                        <Accordion allowZeroExpanded>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Show Upcoming Matchup Stats
                                        </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p id="matchup_stats1">
                                        No Matchup Stats Currently Available
                                        </p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="player-card">
                    <div class="card-header">
                        <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#2.</h5>
                        <h4 id="name2" style={{ 'text-align': 'center', 'float': 'center' }}></h4>
                        <h5 id="pos2"></h5>
                    </div>
                    <div className="card-body">
                        <img id="img2" src={playerIcon} alt="" ></img>
                        <div id="stats2" className="text-center uniform-lines"></div>
                        <Accordion allowZeroExpanded>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Show Upcoming Matchup Stats
                                        </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p id="matchup_stats2">
                                        No Matchup Stats Currently Available
                                        </p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="player-card">
                    <div class="card-header">
                        <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#3.</h5>
                        <h4 id="name3" style={{ 'text-align': 'center', 'float': 'center' }}></h4>
                        <h5 id="pos3"></h5>
                    </div>
                    <div className="card-body">
                        <img id="img3" src={playerIcon} alt="" ></img>
                        <div id="stats3" className="text-center uniform-lines"></div>
                        <Accordion allowZeroExpanded>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Show Upcoming Matchup Stats
                                        </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p id="matchup_stats3">
                                        No Matchup Stats Currently Available
                                        </p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="player-card">
                    <div class="card-header">
                        <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#4.</h5>
                        <h4 id="name4" style={{ 'text-align': 'center', 'float': 'center' }}></h4>
                        <h5 id="pos4"></h5>
                    </div>
                    <div className="card-body">
                        <img id="img4" src={playerIcon} alt=""></img>
                        <div id="stats4" className="text-center uniform-lines"></div>
                        <Accordion allowZeroExpanded>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Show Upcoming Matchup Stats
                                        </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p id="matchup_stats4">
                                        No Matchup Stats Currently Available
                                        </p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="player-card">
                    <div class="card-header">
                        <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#5.</h5>
                        <h4 id="name5" style={{ 'text-align': 'center', 'float': 'center' }}></h4>
                        <h5 id="pos5"></h5>
                    </div>
                    <div className="card-body">
                        <img id="img5" src={playerIcon} alt=""></img>
                        <div id="stats5" className="text-center uniform-lines"></div>
                        <Accordion allowZeroExpanded>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Show Upcoming Matchup Stats
                                        </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p id="matchup_stats5">
                                        No Matchup Stats Currently Available
                                        </p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </section>
    );
}

export default TopPickupGrid;