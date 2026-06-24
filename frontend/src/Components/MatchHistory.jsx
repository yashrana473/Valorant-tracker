import React, { useState } from 'react';
import ExpandedStats from './ExpandedStats';

export default function MatchHistory({ matches, ign }) {
  const [openMatchIdx, setOpenMatchIdx] = useState(null);

  if (!matches || !matches.length) return null;

  return (
    <div className="w-full max-w-2xl mt-6 space-y-4 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-300 mb-3 uppercase tracking-wide">
        Recent <span className="text-valRed">Matches</span>
      </h3>
      
      {matches.map((match, idx) => {
        const myStats = match.players.all_players.find(
          (p) => p.name.toLowerCase() === ign.toLowerCase()
        );
        if (!myStats) return null;
        
        const team = myStats.team.toLowerCase(); 
        const isWin = match.teams[team].has_won;
        const rounds = match.metadata.rounds_played;

        const { kills, deaths, assists, score, headshots, bodyshots, legshots } = myStats.stats;
        const kd = (kills / Math.max(deaths, 1)).toFixed(2);
        const acs = Math.round(score / rounds);

        const totalHits = headshots + bodyshots + legshots;
        const hsPct = totalHits > 0 ? Math.round((headshots / totalHits) * 100) : 0;

        const isOpen = openMatchIdx === idx;

        return (
          <div key={idx} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-md">

            <div 
              onClick={() => setOpenMatchIdx(isOpen ? null : idx)}
              className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800 transition border-l-4 ${isWin ? 'border-l-green-500' : 'border-l-valRed'}`} 
            >
              <div className="w-1/4">
                <h4 className="font-bold truncate text-gray-100">{match.metadata.map}</h4>
                <p className={`text-[11px] font-bold mt-1 tracking-wider ${isWin ? 'text-green-400' : 'text-valRed'}`}>
                  {isWin ? 'VICTORY' : 'DEFEAT'}
                </p>
              </div>
              
              <div className="text-center w-1/4">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">K / D / A</p>
                <p className="font-bold text-gray-200 mt-1">{kills} / {deaths} / {assists}</p>
              </div>
              
              <div className="text-center w-1/4">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">HS %</p>
                <p className="font-bold text-valRed mt-1">{hsPct}%</p>
              </div>
              
              <div className="text-right w-1/4 flex flex-col items-end">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">ACS</p>
                <p className="font-bold text-gray-200 mt-1">{acs}</p>
                <span className="text-gray-600 text-[10px] mt-1 font-bold uppercase">{isOpen ? 'Close ▲' : 'Stats ▼'}</span>
              </div>
            </div>
            {isOpen && (
              <ExpandedStats 
                match={match} 
                myStats={myStats} 
                roundsPlayed={rounds} 
              />
            )}
            
          </div>
        );
      })}
    </div>
  );
}