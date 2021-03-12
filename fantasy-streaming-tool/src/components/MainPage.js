import 'firebase/auth';
import '../App.css';
import { useState} from 'react'

import LeagueMenu from './LeagueMenu'
import NavBar from './NavBar'
import TopPickupGrid from './TopPickupGrid'
const MainPage = (props) => {
    const [playerData, sendPlayerData] = useState('')
    return (
        <div className="main-page">
            <NavBar auth={props.auth}></NavBar>
                <LeagueMenu sendPlayerData={sendPlayerData}></LeagueMenu>
                <TopPickupGrid playerData={playerData} ></TopPickupGrid>
        </div>

    );
}

export default MainPage;