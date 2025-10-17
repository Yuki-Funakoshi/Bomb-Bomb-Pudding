
import React from 'react';
import { PlayerStats as PlayerStatsType } from '../types';

interface PlayerStatsProps {
  stats: PlayerStatsType;
  turn: number;
}

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold text-lg text-indigo-300">{value}</span>
    </div>
);


const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, turn }) => {
  return (
    <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
      <h2 className="text-xl font-bold mb-3 text-center text-indigo-400 border-b-2 border-gray-700 pb-2">STATUS</h2>
      <div className="space-y-2">
        <StatItem label="Turn" value={turn} />
        <StatItem label="Fire Power" value={'💥'.repeat(stats.firePower)} />
        <StatItem label="Max Bombs" value={'💣'.repeat(stats.maxBombs)} />
      </div>
    </div>
  );
};

export default PlayerStats;
