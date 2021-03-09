import 'firebase/auth';
import './App.css';
import { useState} from 'react'

import LeagueMenu from './LeagueMenu'
import NavBar from './NavBar'
import TopPickupGrid from './TopPickupGrid'
const MainPage = (props) => {
    const [playerData, sendPlayerData] = useState('')
    return (
        <div className="main-page">
            <NavBar auth={props.auth}></NavBar>
            <playerDataContextProvider>
                <LeagueMenu sendPlayerData={sendPlayerData}></LeagueMenu>
                <br></br>
                <br></br>
                <TopPickupGrid playerData={playerData} ></TopPickupGrid>
            </playerDataContextProvider>
        </div>

    );
}

export default MainPage;