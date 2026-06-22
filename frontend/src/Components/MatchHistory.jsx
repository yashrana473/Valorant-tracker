import React from 'react';

export default function MatchHistory({ matches, ign }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mt-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-300 mb-2 uppercase tracking-wide">
        Match <span className="text-valRed">History</span>
      </h3>
      
      {matches.map((match, index) => {
        const myStats = match.players.all_players.find(
          (p) => p.name.toLowerCase() === ign.toLowerCase()
        );
        
        if (!myStats) return null;
        
        // win/loss
        const team = myStats.team.toLowerCase(); 
        const isWin = match.teams[team].has_won;
        
        // kd and acs
        const kills = myStats.stats.kills;
        const deaths = myStats.stats.deaths;
        const assists = myStats.stats.assists;
        
        const kd = (kills / Math.max(deaths, 1)).toFixed(2);
        const acs = Math.round(myStats.stats.score / match.metadata.rounds_played);

        return (
          <div 
            key={index} 
            className={`flex justify-between items-center bg-gray-900 p-4 rounded-lg border-l-4 ${isWin ? 'border-l-green-500' : 'border-l-valRed'} border-t-gray-800 border-r-gray-800 border-b-gray-800 transition hover:bg-gray-800`}
          >
            <div className="w-1/4">
              <h4 className="font-bold truncate text-gray-100">{match.metadata.map}</h4>
              <p className={`text-x font-bold mt-1 tracking-wide ${isWin ? 'text-green-400' : 'text-valRed'}`}>
                {isWin ? 'VICTORY' : 'DEFEAT'}
              </p>
            </div>
            
            <div className="text-center w-1/3">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">K/D/A</p>
              <p className="font-bold text-gray-200 mt-1">{kills} / {deaths} / {assists}</p>
              <p className="text-xs text-gray-400 mt-1">
                KD: <span className={kd >= 1 ? 'text-green-400' : 'text-valRed'}>{kd}</span>
              </p>
            </div>
            
            <div className="text-right w-1/4">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">ACS</p>
              <p className="font-bold text-gray-200 mt-1">{acs}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}