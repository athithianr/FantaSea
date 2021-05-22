import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const GridPlayer = ({rank, playerImg, playerName, playerPosition}) => {
    
    return (
        <div className="player-card">
            <div className="card-header">
                <h5 style={{ 'textAlign': 'left', 'float': 'left' }}>#{rank + 1}.{" "}</h5>
                <h4 id="name" style={{ 'textAlign': 'center', 'float': 'center' }}>{playerName}</h4>
                <h5 id="pos">{playerPosition}</h5>
            </div>
            <div className="card-body">
                <img id="img" src={playerImg} alt=""></img>
                <div id="stats" className="text-center uniform-lines">
                </div>
                <Accordion allowZeroExpanded>
                    <AccordionItem>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                Show Upcoming Matchup Stats
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <p id="matchup_stats">
                                No Matchup Stats Currently Available
                            </p>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>

    );
}

export default GridPlayer;