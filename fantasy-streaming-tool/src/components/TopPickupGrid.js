import playerIcon from '../images/empty_profile_icon.png'
const axios = require('axios')

async function getPlayerStats(playerData) {
    let player_keys = [];
    for (let i = 0; i < playerData.length; i++) {
        player_keys.push(playerData[i].player_key)
    }
    axios.get(`http://localhost:5000/getPlayerStats/${player_keys}`)
        .then(res => {
            console.log(res.data)
        }
        )
}

const TopPickupGrid = ({ playerData }) => {

    function populatePlayerGrid() {
        let position = "";
        let img = playerIcon;
        let name = "";
        for (let i = 0; i < 5; i++) {
            img = 'https' + playerData[i].image_url[0].replace(/https.*\/https/, '');
            name = playerData[i].name[0].full[0];
            position = playerData[i].display_position[0];
            document.getElementById(`img${i + 1}`).src = img;
            document.getElementById(`name${i + 1}`).innerHTML = name;
            document.getElementById(`pos${i + 1}`).innerHTML = position;
        }
        return;
    }


    if (playerData) {
        getPlayerStats(playerData)
        populatePlayerGrid()
    }

    return (
        <section className="playerGrid">
            <div className="container">
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopPickupGrid;