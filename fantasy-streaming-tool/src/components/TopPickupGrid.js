import GridPlayer from './GridPlayer.js'
import GridPlayerTemp from './GridPlayerTemp.js'
import playerIcon from '../images/empty_profile_icon.png'


const TopPickupGrid = ({ playerData, advancedStats }) => {
    if (typeof (playerData) === 'object') {
        const renderedPlayerList = playerData[0].map((player, index) => {
            const img = 'https' + player.image_url[0].replace(/https.*\/https/, '');
            return <GridPlayer rank={index} playerImg={img} playerName={player.name[0].full[0]} playerPosition={player.display_position[0]} allPlayerStats={playerData[1].player} allMatchupStats={advancedStats} key={index + Math.random()}/>;
        });

        return (
            <section className="playerGrid">
                <h2 className="top-player-grid text-center my-1">Top Player Pickups</h2>
                <div className="player-grid text-center">{renderedPlayerList}</div>
            </section>
        );
    }



    else {
        let foo = [1, 2, 3, 4, 5];
        const renderedPlayerList = foo.map((player, index) => {
            return <GridPlayerTemp rank={index} playerImg={playerIcon} playerName={''} playerPosition={''} key={index + Math.random()}/>;
        });
        return (
            <section className="playerGrid">
                <h2 className="top-player-grid text-center my-1">Top Player Pickups</h2>
                <div className="player-grid text-center">{renderedPlayerList}</div>
            </section>
        );
    }
}

export default TopPickupGrid;