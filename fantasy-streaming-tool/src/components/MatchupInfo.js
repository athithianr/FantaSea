import ContentLoader from 'styled-content-loader'



const MatchupInfo = ({ matchupData }) => {
    function populateMatchupDiff() {
        let matchup_diffs = "";
        let color;
        for (let i = 0; i < 7; i++) {
            color = matchupData[2][matchupData[1][i][0]] === 1 ? 'green' : 'red';
            matchup_diffs += `<p style=font-size:15px;color:${color}>${stat_mappings[matchupData[1][i][0]]}: ${matchupData[1][i][1]}</p>`
        }
        document.getElementById("matchup_diff").innerHTML = matchup_diffs;
        return;
    }

    let opponent;
    const stat_mappings = {
        '10': 'Threes',
        '12': 'Points',
        '15': 'Rebounds',
        '16': 'Assists',
        '17': 'Steals',
        '18': 'Blocks',
        '19': 'Turnovers'
    }

    if (matchupData) {
        populateMatchupDiff();
        opponent = matchupData[0].fantasy_content.team[0].matchups[0].matchup[0].teams[0].team[1].name[0];
    }
    return (
        <>
            <h2 className="dropdown-heading text-center my-1">Matchup Differentials</h2>
            <ContentLoader style={{ 'height': '268.38px' }} isLoading={typeof matchupData != "object"}>
                <div style={{ 'border': '1px solid #aaa', 'borderRadius': '.5em', 'height': '100%' }}>
                    <h3 style={{ padding: '10px' }}>Opponent: {opponent}</h3>
                    <div className="text-center" id="matchup_diff" style={{ 'lineHeight': '15px' }}>
                    </div>
                </div>
            </ContentLoader>

        </>
    );
}

export default MatchupInfo;