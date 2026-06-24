import React from 'react';

export default function ExpandedStats({ match, myStats, roundsPlayed }) {
  const { damage_made } = myStats.stats;
  const puuid = myStats.puuid;

  const sortedPlayers = [...match.players.all_players].sort((a, b) => b.stats.score - a.stats.score);
  const placement = sortedPlayers.findIndex(p => p.puuid === puuid) + 1;
  const isMvp = placement === 1;

  const adr = Math.round(damage_made / roundsPlayed);
  let fk = 0;
  let fd = 0;
  let multiKills = 0;

  if (match.kills && match.kills.length > 0) {
    const roundsMap = {};
    match.kills.forEach(k => {
      if (!roundsMap[k.round]) roundsMap[k.round] = [];
      roundsMap[k.round].push(k);
    });

    Object.values(roundsMap).forEach(roundKills => {
      roundKills.sort((a, b) => a.time_in_round - b.time_in_round);
      const firstKill = roundKills[0];
      if (firstKill.killer_puuid === puuid) fk++;
      if (firstKill.victim_puuid === puuid) fd++;
      const myKillsThisRound = roundKills.filter(k => k.killer_puuid === puuid).length;
      if (myKillsThisRound >= 2) multiKills++;
    });
  }

  return (
    <div className="bg-gray-800/60 p-5 border-t border-gray-800 animate-fade-in grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
        {isMvp ? (
          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(234,179,8,0.15)]">
            Match MVP
          </span>
        ) : (
          <span className="bg-gray-800 border border-gray-600 text-gray-400 px-3 py-1.5 rounded text-xs font-bold uppercase">
            {placement}th Place
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">ADR</p>
        <p className="font-bold text-sm text-gray-200 mt-0.5">{adr}</p>
      </div>

      <div className="text-center flex justify-center gap-4">
        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">FK</p>
          <p className="font-bold text-sm text-green-400 mt-0.5">{fk}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">FD</p>
          <p className="font-bold text-sm text-red-400 mt-0.5">{fd}</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Multi-Kills</p>
        <p className="font-bold text-sm text-purple-400 mt-0.5">{multiKills}</p>
      </div>

    </div>
  );
}