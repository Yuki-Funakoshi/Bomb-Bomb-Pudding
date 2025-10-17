
import React, { useState } from 'react';
import { GameStatus } from '../types';

interface ControlsProps {
  onAction: (action: string) => void;
  gameStatus: GameStatus;
}

const Controls: React.FC<ControlsProps> = ({ onAction, gameStatus }) => {
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
