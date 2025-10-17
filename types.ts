
export enum CellType {
  Empty = ' ',
  BreakableBlock = 'B',
  UnbreakableBlock = 'X',
  Enemy = 'E',
  Player = 'P',
  Goal = 'G',
}

export enum ItemType {
  FireUp = 'fire',
  BombUp = 'bomb',
}

export enum GameStatus {
  StartScreen = 'start',
  Playing = 'playing',
  Win = 'win',
  Lose = 'lose',
}

export type Coords = {
  x: number;
  y: number;
};

export type Player = Coords;

export type Enemy = Coords & { id: number };

export type Bomb = Coords & { timer: number };

export type Explosion = Coords;

export type Item = Coords & { type: ItemType };

export type PlayerStats = {
  firePower: number;
  maxBombs: number;
};

export type GameMap = string[][];

export type GameState = {
  map: GameMap;
  player: Player;
  enemies: Enemy[];
  bombs: Bomb[];
  explosions: Explosion[];
  items: Item[];
  goal: Coords;
  isGoalVisible: boolean;
  playerStats: PlayerStats;
  gameStatus: GameStatus;
  turn: number;
};
