const MatchupStats = (matchupStats) => {
    return (
        <>
            <p style={{ 'fontSize': '15px' }}>
                <span style={{ 'fontWeight': 'bolder' }}>Opponent Team: </span>
                {matchupStats.matchupStats.opponent_team}
            </p>
            <p style={{ 'fontSize': '15px' }}>
                <span style={{ 'fontWeight': 'bolder' }}>Date: </span>
                {matchupStats.matchupStats.date}
            </p>
            <p style={{ 'fontSize': '15px' }}>
                <span style={{ 'fontWeight': 'bolder' }}>Primary Position: </span>
                {matchupStats.matchupStats.primary_position}
            </p>
            <p style={{ 'fontSize': '15px' }}>
                <span style={{ 'fontWeight': 'bolder' }}>Stat Category: </span>
                {matchupStats.matchupStats.stat_category}
            </p>
            <p style={{ 'fontSize': '15px' }}>
                <span style={{ 'fontWeight': 'bolder' }}>Stat Total: </span>
                {matchupStats.matchupStats.stat_total}
            </p>
            <br></br>
        </>
    );
}

export default MatchupStats;