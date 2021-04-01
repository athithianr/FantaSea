import PlayerStats from './PlayerStats.js'
import MatchupStats from './MatchupStats.js'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const GridPlayer = ({ rank, playerImg, playerName, playerPosition, allPlayerStats, allMatchupStats }) => {
    const stat_mappings = {
        '10': 'Threes',
        '12': 'Points',
        '15': 'Rebounds',
        '16': 'Assists',
        '17': 'Steals',
        '18': 'Blocks',
        '19': 'Turnovers'
    }
    const keys = Object.keys(stat_mappings)
    let stats = {}
    const games_played = allPlayerStats[rank].player_stats[0].stats[0].stat[0].value[0]
    const renderedPlayerStats = keys.map((NA, index) => {
        stats[allPlayerStats[rank].player_stats[0].stats[0].stat[keys[index]].stat_id[0]] = (allPlayerStats[rank].player_stats[0].stats[0].stat[keys[index]].value[0] / games_played).toFixed(1);
        let stat_category = stat_mappings[allPlayerStats[rank].player_stats[0].stats[0].stat[keys[index]].stat_id[0]]
        let statistic = (allPlayerStats[rank].player_stats[0].stats[0].stat[keys[index]].value[0] / games_played).toFixed(1)
        return <PlayerStats stat={statistic} statCategory={stat_category} key={index + Math.random()}></PlayerStats>
    });
    let renderedMatchupStats;
    if (allMatchupStats) {
        renderedMatchupStats = allMatchupStats[rank].map((x,index) => {
            return <MatchupStats matchupStats={x} key={index + Math.random()}></MatchupStats>
        });
    }
    return (
        <div className="player-card">
            <div className="card-header">
                <h5 style={{ 'textAlign': 'left', 'float': 'left' }}>#{rank + 1}.{" "}</h5>
                <h4 id="name" style={{ 'textAlign': 'center', 'float': 'center' }}>{playerName}</h4>
                <h5 id="pos">{playerPosition}</h5>
            </div>
            <div className="card-body">
                <img id="img" src={playerImg} alt=""></img>
                <div id='stats' className="text-center uniform-lines">
                    <br>
                    </br>
                    <h3>Average Stats(last month): </h3>
                    <p>Total Games Played: {games_played}</p>
                    {renderedPlayerStats}
                </div>
                <Accordion allowZeroExpanded>
                    <AccordionItem>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                Show Upcoming Matchup Stats
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div id="matchup_stats">
                                {renderedMatchupStats || 'No Matchup Stats Currently Available'}
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>

    );
}

export default GridPlayer;