const PlayerStats = ({stat, statCategory}) => {
    return (
<p style={{'fontSize':'15px'}}>
    {statCategory}: {stat}
</p>
     );
}
 
export default PlayerStats;