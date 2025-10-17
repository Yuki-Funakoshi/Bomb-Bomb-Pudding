
import React, { useState, useCallback, useEffect } from 'react';
import {
  GameStatus,
  GameState,
  Coords,
  CellType,
  ItemType,
  Enemy,
  Bomb,
  Explosion,
  Item,
} from './types';
import { INITIAL_MAP_LAYOUT, BOMB_TIMER, EXPLOSION_DURATION } from './constants';
import GameBoard from './components/GameBoard';
import PlayerStats from './components/PlayerStats';
import Controls from './components/Controls';
import MessageLog from './components/MessageLog';

const parseInitialMap = (): Omit<GameState, 'gameStatus' | 'turn' | 'playerStats' | 'isGoalVisible' | 'explosions'> => {
  const map: string[][] = [];
  let player: Coords = { x: 0, y: 0 };
  const enemies: Enemy[] = [];
  const bombs: Bomb[] = [];
  const items: Item[] = [];
  let goal: Coords = {x: 0, y: 0};
  let enemyIdCounter = 0;

  INITIAL_MAP_LAYOUT.forEach((rowStr, y) => {
    const row = rowStr.split('');
    map.push(row.map((cell, x) => {
      switch (cell) {
        case CellType.Player:
          player = { x, y };
          return CellType.Empty;
        case CellType.Enemy:
          enemies.push({ id: enemyIdCounter++, x, y });
          return CellType.Empty;
        case CellType.Goal:
          goal = { x, y };
          return CellType.BreakableBlock; // Hide goal under a block
        default:
          return cell;
      }
    }));
  });
  
  // Hardcode some items under breakable blocks for consistent gameplay
  const itemLocations: {coords: Coords, type: ItemType}[] = [
    {coords: {x: 3, y: 1}, type: ItemType.FireUp},
    {coords: {x: 1, y: 3}, type: ItemType.BombUp},
  ];

  itemLocations.forEach(itemLoc => {
      if(map[itemLoc.coords.y][itemLoc.coords.x] === CellType.BreakableBlock){
          // This is a simplified way; a more robust system would store this association elsewhere.
          // For this app, we will add the item when the block is destroyed.
      }
  });


  return { map, player, enemies, bombs, items, goal };
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
        ...parseInitialMap(),
        playerStats: { firePower: 1, maxBombs: 1 },
        gameStatus: GameStatus.StartScreen,
        turn: 0,
        isGoalVisible: false,
        explosions: [],
    }
  });
  const [message, setMessage] = useState('Type "start" to begin your adventure!');

  const processTurn = useCallback((action: string) => {
    if (gameState.gameStatus !== GameStatus.Playing) return;

    let newState: GameState = JSON.parse(JSON.stringify(gameState));
    let newMessages: string[] = [];

    // 1. Player Action
    const move = (dx: number, dy: number) => {
      const newPos = { x: newState.player.x + dx, y: newState.player.y + dy };
      if ([' ', CellType.Goal].includes(newState.map[newPos.y][newPos.x])) {
        newState.player = newPos;
      }
    };

    const command = action.toLowerCase().split(' ');
    switch (command[0]) {
      case 'move':
        if (command[1] === 'up') move(0, -1);
        if (command[1] === 'down') move(0, 1);
        if (command[1] === 'left') move(-1, 0);
        if (command[1] === 'right') move(1, 0);
        break;
      case 'bomb':
      case 'place':
        if (newState.bombs.filter(b => b.x === newState.player.x && b.y === newState.player.y).length === 0) {
            if (newState.bombs.length < newState.playerStats.maxBombs) {
                newState.bombs.push({ ...newState.player, timer: BOMB_TIMER });
            } else {
                newMessages.push("You can't place any more bombs!");
            }
        }
        break;
      case 'wait':
        break; // Do nothing
      default:
        newMessages.push(`Unknown command: "${action}"`);
    }

    // Tick down bomb timers before explosion checks
    newState.bombs.forEach(bomb => bomb.timer--);

    // 2. Bomb Explosions
    const explodingBombs = newState.bombs.filter(bomb => bomb.timer === 0);
    let newExplosions: Explosion[] = [];

    explodingBombs.forEach(bomb => {
        newExplosions.push({x: bomb.x, y: bomb.y});
        const directions = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
        for (const dir of directions) {
            for (let i = 1; i <= newState.playerStats.firePower; i++) {
                const ex = bomb.x + dir.x * i;
                const ey = bomb.y + dir.y * i;
                if(newState.map[ey]?.[ex] === CellType.UnbreakableBlock) break;

                newExplosions.push({x: ex, y: ey});

                if(newState.map[ey]?.[ex] === CellType.BreakableBlock) {
                    newState.map[ey][ex] = CellType.Empty;
                     // Check for goal
                    if(ey === newState.goal.y && ex === newState.goal.x) {
                        newState.isGoalVisible = true;
                        newState.map[ey][ex] = CellType.Goal;
                        newMessages.push("The exit has been revealed!");
                    }
                    // Simple item drop logic
                    if(Math.random() < 0.3) { // 30% chance to drop an item
                        const itemType = Math.random() < 0.5 ? ItemType.FireUp : ItemType.BombUp;
                        newState.items.push({x:ex, y:ey, type: itemType});
                        newMessages.push(`A ${itemType === ItemType.FireUp ? 'Fire Up' : 'Bomb Up'} item appeared!`);
                    }
                    break;
                }
            }
        }
    });
    
    newState.explosions = newExplosions;
    newState.bombs = newState.bombs.filter(bomb => bomb.timer > 0);

    // 3. Move Enemies
    newState.enemies.forEach(enemy => {
        const directions = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
        const validMoves = directions.filter(dir => {
            const nextX = enemy.x + dir.x;
            const nextY = enemy.y + dir.y;
            return newState.map[nextY]?.[nextX] === CellType.Empty;
        });
        if(validMoves.length > 0) {
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            enemy.x += move.x;
            enemy.y += move.y;
        }
    });

    // 4. Collision & Status Checks
    // Explosion collisions
    newState.explosions.forEach(exp => {
        if(exp.x === newState.player.x && exp.y === newState.player.y) {
            newState.gameStatus = GameStatus.Lose;
            newMessages.push("You were caught in an explosion! Game Over.");
        }
        newState.enemies = newState.enemies.filter(enemy => {
            if (enemy.x === exp.x && enemy.y === exp.y) {
                newMessages.push("An enemy was defeated!");
                return false;
            }
            return true;
        });
    });

    // Enemy collisions
    newState.enemies.forEach(enemy => {
        if (enemy.x === newState.player.x && enemy.y === newState.player.y) {
            newState.gameStatus = GameStatus.Lose;
            newMessages.push("You ran into an enemy! Game Over.");
        }
    });

    // Item pickup
    newState.items = newState.items.filter(item => {
        if (item.x === newState.player.x && item.y === newState.player.y) {
            if (item.type === ItemType.FireUp) {
                newState.playerStats.firePower++;
                newMessages.push("Fire power increased!");
            } else if (item.type === ItemType.BombUp) {
                newState.playerStats.maxBombs++;
                newMessages.push("Max bombs increased!");
            }
            return false;
        }
        return true;
    });

    // Win condition
    if (newState.isGoalVisible && newState.player.x === newState.goal.x && newState.player.y === newState.goal.y) {
        newState.gameStatus = GameStatus.Win;
        newMessages.push("Congratulations! You've found the exit and escaped!");
    }
    
    // Set next turn state
    newState.turn++;
    setGameState(newState);
    setMessage(newMessages.length > 0 ? newMessages.join(' ') : 'Turn ended. Your move.');

  }, [gameState]);
  
  // This effect handles the transition from explosion visibility to nothing
  useEffect(() => {
    if (gameState.explosions.length > 0 && gameState.gameStatus === GameStatus.Playing) {
        const timer = setTimeout(() => {
            setGameState(prev => ({...prev, explosions: []}));
        }, 500); // Show explosions for half a second
        return () => clearTimeout(timer);
    }
  }, [gameState.explosions, gameState.gameStatus]);


  const handleAction = (action: string) => {
    const command = action.trim().toLowerCase();
    if (command === 'start' && gameState.gameStatus === GameStatus.StartScreen) {
        setGameState(prev => ({
            ...prev,
            gameStatus: GameStatus.Playing,
        }));
        setMessage("Game started! Use 'move [up/down/left/right]' or 'bomb'.");
    } else if (gameState.gameStatus === GameStatus.Playing) {
        processTurn(command);
    } else if (command === 'restart') {
       setGameState({
            ...parseInitialMap(),
            playerStats: { firePower: 1, maxBombs: 1 },
            gameStatus: GameStatus.Playing,
            turn: 0,
            isGoalVisible: false,
            explosions: [],
       });
       setMessage("Game restarted! Your move.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-4xl mx-auto p-4 border-4 border-indigo-500 rounded-lg bg-black/50 shadow-lg shadow-indigo-500/30">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-400 tracking-widest">REACT BOMBERMAN</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
                <GameBoard gameState={gameState} />
            </div>
            <div className="w-full md:w-64 flex flex-col gap-4">
                <PlayerStats stats={gameState.playerStats} turn={gameState.turn} />
                <MessageLog message={message} />
                <Controls onAction={handleAction} gameStatus={gameState.gameStatus} />
            </div>
        </div>
      </div>
       <footer className="text-center mt-4 text-gray-500 text-xs">
          Commands: move [up|down|left|right], bomb, wait.
          {gameState.gameStatus !== GameStatus.Playing && " (start / restart)"}
        </footer>
    </div>
  );
};

export default App;
