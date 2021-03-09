import playerIcon from './images/empty_profile_icon.png'



const TopPickupGrid = ({playerData}) => {
    const img1 = playerData?'https' + playerData.data[0].image_url[0].replace(/https.*\/https/, ''):playerIcon;
    const img2 = playerData?'https' + playerData.data[1].image_url[0].replace(/https.*\/https/, ''):playerIcon;
    const img3 = playerData?'https' + playerData.data[2].image_url[0].replace(/https.*\/https/, ''):playerIcon;
    const img4 = playerData?'https' + playerData.data[3].image_url[0].replace(/https.*\/https/, ''):playerIcon;
    const img5 = playerData?'https' + playerData.data[4].image_url[0].replace(/https.*\/https/, ''):playerIcon;
    return (
        <section className="playerGrid">
            <div className="container">
                <h2 className="top-player-grid text-center my-1">Top Player Pickups</h2>
                <div className="player-grid text-center">
                    <div className="player-card">
                        <div class="card-header">
                            <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#1.</h5>
                        </div>
                        <div className="card-body">
                            <img src={img1} alt=""></img>
                        </div>
                    </div>
                    <div className="player-card">
                        <div class="card-header">
                            <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#2.</h5>
                        </div>
                        <div className="card-body">
                            <img src={img2} alt="" ></img>

                        </div>
                    </div>
                    <div className="player-card">
                        <div class="card-header">
                            <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#3.</h5>
                        </div>
                        <div className="card-body">
                            <img src={img3} alt="" ></img>
                        </div>
                    </div>
                    <div className="player-card">
                        <div class="card-header">
                            <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#4.</h5>
                        </div>
                        <div className="card-body">
                            <img src={img4} alt=""></img>
                        </div>
                    </div>
                    <div className="player-card">
                        <div class="card-header">
                            <h5 style={{ 'text-align': 'left', 'float': 'left' }}>#5.</h5>
                        </div>
                        <div className="card-body">
                            <img src={img5} ></img>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopPickupGrid;