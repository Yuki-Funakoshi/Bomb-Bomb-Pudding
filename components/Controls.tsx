
import React, { useState } from 'react';
import { GameStatus, Rules, PlayerStats } from '../types';

interface ControlsProps {
  onAction: (action: string) => void;
  gameStatus: GameStatus;
  rules: Rules;
  playerStats: PlayerStats;
  onSetBombTimer: (next: number) => void;
  onAdjustStat: (key: 'firePower' | 'maxBombs', delta: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ onAction, gameStatus, rules, playerStats, onSetBombTimer, onAdjustStat }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAction(inputValue.trim());
      setInputValue('');
    }
  };

  const getPlaceholderText = () => {
    switch (gameStatus) {
      case GameStatus.StartScreen:
        return 'Type "start" to begin';
      case GameStatus.Playing:
        return 'Enter command...';
      case GameStatus.Win:
      case GameStatus.Lose:
        return 'Type "restart" to play again';
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
      <h2 className="text-xl font-bold mb-3 text-center text-indigo-400 border-b-2 border-gray-700 pb-2">ACTION</h2>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('move up')} disabled={gameStatus !== GameStatus.Playing}>
          ↑ Up
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('bomb')} disabled={gameStatus !== GameStatus.Playing}>
          Place Bomb
        </button>
        <div className="col-span-2 grid grid-cols-3 gap-2">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('move left')} disabled={gameStatus !== GameStatus.Playing}>
            ← Left
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('wait')} disabled={gameStatus !== GameStatus.Playing}>
            Wait
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('move right')} disabled={gameStatus !== GameStatus.Playing}>
            Right →
          </button>
        </div>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded" onClick={() => onAction('move down')} disabled={gameStatus !== GameStatus.Playing}>
          ↓ Down
        </button>
        {gameStatus === GameStatus.StartScreen && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded" onClick={() => onAction('start')}>
            Start
          </button>
        )}
        {(gameStatus === GameStatus.Win || gameStatus === GameStatus.Lose) && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded" onClick={() => onAction('restart')}>
            Restart
          </button>
        )}
      </div>

      <div className="mb-3 p-3 border border-gray-700 rounded">
        <div className="text-sm text-gray-300 mb-2 font-semibold">Rules</div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Bomb Timer:</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onSetBombTimer(rules.bombTimer - 1)}>-</button>
          <span className="px-2 py-1 bg-black/40 rounded text-white w-8 text-center">{rules.bombTimer}</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onSetBombTimer(rules.bombTimer + 1)}>+</button>
        </div>
      </div>

      <div className="mb-3 p-3 border border-gray-700 rounded">
        <div className="text-sm text-gray-300 mb-2 font-semibold">Player Stats</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 text-sm">Fire Power:</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onAdjustStat('firePower', -1)}>-</button>
          <span className="px-2 py-1 bg-black/40 rounded text-white w-8 text-center">{playerStats.firePower}</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onAdjustStat('firePower', 1)}>+</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Max Bombs:</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onAdjustStat('maxBombs', -1)}>-</button>
          <span className="px-2 py-1 bg-black/40 rounded text-white w-8 text-center">{playerStats.maxBombs}</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={() => onAdjustStat('maxBombs', 1)}>+</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getPlaceholderText()}
          className="w-full bg-gray-900 border-2 border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          autoFocus
        />
        <button
          type="submit"
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Controls;
