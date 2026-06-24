import React, { useState } from "react";
import axios from 'axios';
import MatchHistory from './components/MatchHistory';


function App() {
  const [ign, setIgn] = useState('');
  const [tag, setTag] = useState('');

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState(null);
  const [mmr, setMmr] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getPlayerStats = async (e) => {
    e.preventDefault();
    if (!ign || !tag) return;

    const fixedTag = tag.replace('#', '');
  
    setLoading(true); 
    setErrorMsg(null); 
    setProfile(null); 
    setMatches(null); 
    setMmr(null);

    try {
      const res = await axios.get(`http://localhost:3000/api/player/${ign}/${fixedTag}`);
      
      setProfile(res.data.profile);
      setMatches(res.data.matches);
      setMmr(res.data.mmr);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Player not found or Server Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-valDark text-white flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-widest uppercase mb-2">Valorant <span className="text-valRed">Tracker</span></h1>
      </div>

      <form onSubmit={getPlayerStats} className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl border border-gray-800 mb-8">
        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Riot ID (e.g. WrAth)" 
            value={ign} 
            onChange={(e) => setIgn(e.target.value)} 
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-3 px-4 focus:border-valRed outline-none" 
          />
          <input 
            type="text" 
            placeholder="#1120" 
            value={tag} 
            onChange={(e) => setTag(e.target.value)} 
            className="w-1/3 bg-gray-800 text-white border border-gray-700 rounded py-3 px-4 focus:border-valRed outline-none" 
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-valRed hover:bg-red-600 font-bold py-3 px-4 rounded uppercase disabled:bg-gray-600">
          {loading ? 'Searching...' : 'Analyze Profile'}
        </button>
      </form>

      {errorMsg && <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8">{errorMsg}</div>}

      {profile && mmr && (
        <div className="w-full flex flex-col items-center pb-10 animate-fade-in">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="relative h-32 bg-gray-800">
              <img src={profile.card.wide} alt="Banner" className="w-full h-full object-cover opacity-60" />
              <img src={profile.card.small} alt="Icon" className="absolute -bottom-7.5 left-6 w-20 h-20 border-4 border-gray-900 rounded-lg" />
              {mmr.images && <img src={mmr.images.small} alt="Rank" className="absolute -bottom-5 right-6 w-16 h-16 drop-shadow-xl" />}
            </div>
            <div className="pt-10 pb-6 px-6">
              <h2 className="text-3xl font-bold">{profile.name} <span className="text-gray-500 text-xl font-normal">#{profile.tag}</span></h2>
              <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-gray-800 border border-gray-700 rounded px-3 py-1">
                    <span className="text-gray-400 font-semibold text-sm uppercase">Level:</span>
                    <span className="ml-2 text-valRed font-bold">{profile.account_level}</span>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded px-3 py-1">
                    <span className="text-gray-400 font-semibold text-sm uppercase">Rank:</span>
                    <span className="ml-2 text-green-400 font-bold">{mmr.currenttierpatched} ({mmr.ranking_in_tier} RR)</span>
                  </div>
              </div>
            </div>
          </div>
          <MatchHistory matches={matches} ign={profile.name} />
        </div>
      )}
    </div>
  );
}

export default App;