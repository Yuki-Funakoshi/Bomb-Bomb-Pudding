
import React from 'react';
import { GameState, CellType, ItemType } from '../types';

interface GameBoardProps {
  gameState: GameState;
}

const getCellContent = (
    x: number,
    y: number,
    { player, enemies, bombs, explosions, items, map }: GameState
) => {
    if (explosions.some(e => e.x === x && e.y === y)) return { char: '🔥', className: 'text-orange-400 animate-pulse' };
    if (player.x === x && player.y === y) return { char: '😎', className: 'text-blue-400' };
    if (enemies.some(e => e.x === x && e.y === y)) return { char: '💀', className: 'text-red-500' };
    if (bombs.some(b => b.x === x && b.y === y)) return { char: '💣', className: 'text-yellow-400 animate-bounce' };
    if (items.some(i => i.x === x && i.y === y)) {
        const item = items.find(i => i.x === x && i.y === y);
        if (item?.type === ItemType.FireUp) return { char: '💥', className: 'text-red-600' };
        if (item?.type === ItemType.BombUp) return { char: '➕', className: 'text-yellow-500' };
    }

    const cell = map[y]?.[x];
    switch (cell) {
        case CellType.UnbreakableBlock: return { char: '▓', className: 'text-gray-500' };
        case CellType.BreakableBlock: return { char: '▒', className: 'text-yellow-800' };
        case CellType.Goal: return { char: '🚪', className: 'text-green-500' };
        case CellType.Empty: return { char: '·', className: 'text-gray-700' };
        default: return { char: ' ', className: '' };
    }
};

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  return (
    <div className="bg-gray-800 p-2 rounded-md border-2 border-gray-700">
      <pre className="text-xl md:text-2xl leading-tight md:leading-tight font-bold text-center">
        {gameState.map.map((row, y) => (
          <div key={y} className="flex justify-center">
            {row.map((_, x) => {
              const { char, className } = getCellContent(x, y, gameState);
              return (
                <span key={x} className={`inline-block w-6 h-6 md:w-8 md:h-8 ${className}`}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default GameBoard;
